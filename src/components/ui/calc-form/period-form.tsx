'use client'

import axios from 'axios'
import { useState } from 'react'
import {
  Label as ChartLabel,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { z } from 'zod'

import type { GetPeriodBody, GetPeriodResponse } from '@/app/api/period/route'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { FEE_BENCHMARK, PLURAL_INTERVAL } from '@/lib/data'
import {
  ConfigSchema,
  convertMonthlyPeriodToInterval,
  FieldSchema,
  formatAsBRL,
  getPeriod,
  handleCurrencyInputChange,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import { FeeInfoCard } from './fee-info-card'

const CalcPeriodSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  present_value: FieldSchema,
  fee: FieldSchema.transform((value) => value / 100),
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
    .optional(),
})

export type CalcPeriodSchema = z.infer<typeof CalcPeriodSchema>

export function PeriodForm() {
  const [periodData, setPeriodData] = useState<GetPeriodResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcPeriodSchema>(CalcPeriodSchema)

  const { periodInterval, feeType, cupom, benchmark } = useConfigParams()

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = calcForm

  const feePeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()[0]
  const contributionPeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()
  const currentBenchmark = FEE_BENCHMARK[benchmark]
  const isFeeTypePre = feeType === 'pre'

  const handleCalcPeriod = async (periodFormData: CalcPeriodSchema) => {
    const payload: GetPeriodBody = {
      present_value: periodFormData.present_value,
      future_value: periodFormData.future_value,
      fee: periodFormData.fee,
      contribution: periodFormData.contribution,
      period_interval: periodFormData.period_interval,
      fee_type: periodFormData.fee_type,
    }

    if (periodFormData.fee_type !== 'pre') {
      payload.benchmark = periodFormData.benchmark
    }
    if (periodFormData.tax) payload.tax = periodFormData.tax
    if (periodFormData.cupom) payload.cupom = periodFormData.cupom_interval

    const { data } = await axios.post<GetPeriodResponse>('/api/period', payload)

    setPeriodData(data)
  }

  const chartData = [
    {
      investedValue: periodData?.investedAmount ?? 0,
      incomeValue: periodData?.discountedIncome ?? periodData?.income,
      tax:
        periodData && periodData.discountedIncome
          ? periodData?.income - periodData.discountedIncome
          : 0,
    },
  ]

  const chartConfig = {
    investment: {
      label: 'Investimento',
    },
    investedValue: {
      label: 'Valor investido',
      color: 'hsl(var(--chart-1))',
    },
    incomeValue: {
      label: 'Rendimento',
      color: 'hsl(var(--chart-2))',
    },
    tax: {
      label: 'Impostos',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  return (
    <div className="flex w-[500px] flex-col gap-4">
      <CalcFormProvider
        onSubmit={handleSubmit(handleCalcPeriod)}
        className="flex w-full basis-1/2 flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="future-value">Quanto você precisa?</Label>
          <Input
            id="future-value"
            placeholder="0"
            inputMode="numeric"
            aria-invalid={fieldsState.future_value.error}
            {...register('future_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          <Label
            htmlFor="future-value"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.future_value.error}
          >
            {fieldsState.future_value.message}
          </Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="present-value">Quanto você tem hoje?</Label>
          <Input
            id="present-value"
            placeholder="0,00"
            inputMode="numeric"
            aria-invalid={fieldsState.present_value.error}
            {...register('present_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          <Label
            htmlFor="present-value"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.present_value.error}
          >
            {fieldsState.present_value.message}
          </Label>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="fee">Qual a taxa do seu investimento?</Label>
            {isFeeTypePre ? null : <FeeInfoCard />}
          </div>
          <Input
            id="fee"
            placeholder="0,00"
            inputMode="numeric"
            aria-invalid={fieldsState.fee.error}
            {...register('fee')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit className="px-3">
              % {isFeeTypePre ? `a.${feePeriodUnit}` : `do ${currentBenchmark}`}
            </InputUnit>
          </Input>
          <Label
            htmlFor="fee"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.fee.error}
          >
            {fieldsState.fee.message}
          </Label>
        </div>

        {!cupom ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="contribution">
              Quanto você vai investir regularmente?
            </Label>
            <Input
              id="contribution"
              placeholder="0,00"
              inputMode="numeric"
              aria-invalid={fieldsState.contribution.error}
              {...register('contribution')}
              onChange={handleCurrencyInputChange}
            >
              <InputUnit corner="left">R$</InputUnit>
              <InputUnit corner="right">Por {contributionPeriodUnit}</InputUnit>
            </Input>
            <Label
              htmlFor="contribution"
              className="text-xs font-bold text-destructive"
              aria-hidden={!fieldsState.contribution.error}
            >
              {fieldsState.contribution.message}
            </Label>
          </div>
        ) : null}

        <Button className="w-full" disabled={isSubmitting}>
          Calcular
        </Button>

        <Box className="flex flex-col items-center justify-center">
          <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Você precisará de
          </h2>
          <strong className="font-mono text-5xl text-slate-700">
            {periodData
              ? convertMonthlyPeriodToInterval(
                  periodData.periodInterval,
                  periodData.periodInDays / 30,
                )
              : 0}
          </strong>
          <span className="text-muted-foreground">
            {PLURAL_INTERVAL[periodInterval]}
          </span>
        </Box>
      </CalcFormProvider>

      <div className="flex basis-1/2 flex-col">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={80} outerRadius={130}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="investment" />}
            />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <ChartLabel
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {periodData?.futureValue ?? 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 13}
                          className="fill-muted-foreground"
                        >
                          R$
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>

            <RadialBar
              dataKey="investedValue"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-investedValue)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="incomeValue"
              fill="var(--color-incomeValue)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="tax"
              fill="var(--color-tax)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <Table className="flex border">
          <TableHeader className="border-r [&_th]:border-b [&_th]:font-bold [&_tr]:border-b-0">
            <TableRow className="flex flex-col">
              <TableHead className="flex h-auto w-[150px] items-center whitespace-nowrap p-4">
                Valor presente
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Valor futuro bruto
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Valor futuro
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Taxa anual
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Taxa anual real
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Período em dias
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Período em dias uteis
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Valor investido
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Rendimento Bruto
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Valor imposto de renda
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Alíquota
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Rendimento liquido de IR
              </TableHead>
              <TableHead className="flex h-auto w-[150px] items-center p-4">
                Rendimento real
              </TableHead>
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Valor médio de cupom
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            <TableRow className="flex flex-col [&_td]:border-b [&_td]:text-end">
              <TableCell>
                {formatAsBRL(periodData?.presentValue ?? 0)}
              </TableCell>
              <TableCell className="h-[80px]">
                {formatAsBRL(periodData?.futureValueGross ?? 0)}
              </TableCell>
              <TableCell>{formatAsBRL(periodData?.futureValue ?? 0)}</TableCell>
              <TableCell>
                {periodData ? periodData?.annualIncomeFee * 100 : 0}%
              </TableCell>
              <TableCell>
                {periodData ? periodData?.realAnnualIncomeFee * 100 : 0}%
              </TableCell>
              <TableCell>{periodData ? periodData?.periodInDays : 0}</TableCell>
              <TableCell className="h-[80px]">
                {periodData ? periodData?.periodInBusinessDays : 0}
              </TableCell>
              <TableCell>
                {formatAsBRL(periodData?.investedAmount ?? 0)}
              </TableCell>
              <TableCell className="h-[80px]">
                {formatAsBRL(periodData?.income ?? 0)}
              </TableCell>
              <TableCell className="h-[80px]">
                {formatAsBRL(chartData[0].tax)}
              </TableCell>
              <TableCell>{(periodData?.tax ?? 0) * 100}%</TableCell>
              <TableCell className="h-[80px]">
                {formatAsBRL(periodData?.discountedIncome ?? 0)}
              </TableCell>
              <TableCell>{formatAsBRL(periodData?.realIncome ?? 0)}</TableCell>
              <TableCell className="h-[80px]">
                {formatAsBRL(periodData?.cupomPaymentAverage ?? 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {/* <pre>
        {isSubmitting ? 'carregando' : JSON.stringify(periodData, null, 2)}
      </pre> */}
      </div>
    </div>
  )
}
