'use client'

import axios from 'axios'
import { useState } from 'react'
import { Label as L, Pie, PieChart } from 'recharts'
import { z } from 'zod'

import { GetFeeBody, GetFeeResponse } from '@/app/api/fee/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import {
  ConfigSchema,
  FieldSchema,
  formatAsBRL,
  formatCompact,
  getPeriod,
  getPeriodUnit,
  handleCurrencyInputChange,
  handleDigitsInputChange,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../chart'
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

const CalcFeeSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  present_value: FieldSchema,
  period: FieldSchema,
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
})

type CalcFeeSchema = z.infer<typeof CalcFeeSchema>

export function FeeForm() {
  const [feeData, setFeeData] = useState<GetFeeResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcFeeSchema>(CalcFeeSchema)

  const { periodInterval } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const periodUnit = getPeriodUnit(periodInterval)
  const contributionPeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()

  const handleCalcFee = async (feeFormData: CalcFeeSchema) => {
    const payload: GetFeeBody = {
      present_value: feeFormData.present_value,
      future_value: feeFormData.future_value,
      contribution: feeFormData.contribution,
      period: feeFormData.period,
      period_interval: feeFormData.period_interval,
    }

    if (feeFormData.tax) payload.tax = feeFormData.tax

    const { data } = await axios.post('/api/fee', payload)

    setFeeData(data)
  }

  const chartData = [
    {
      name: 'invested',
      amount: feeData?.investedAmount ?? 0,
      fill: 'var(--color-invested)',
    },
    {
      name: 'income',
      amount: feeData?.discountedIncome ?? feeData?.income ?? 0,
      fill: 'var(--color-income)',
    },
    {
      name: 'tax',
      amount:
        feeData && feeData.discountedIncome
          ? feeData?.income - feeData.discountedIncome
          : 0,
      fill: 'var(--color-tax)',
    },
  ]

  const chartConfig = {
    invested: {
      label: 'Valor investido',
      color: 'hsl(var(--chart-1))',
    },
    income: {
      label: 'Rendimento',
      color: 'hsl(var(--chart-2))',
    },
    tax: {
      label: 'Impostos',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  const presentValue = formatAsBRL(feeData?.presentValue ?? 0)
  const futureValueGross = formatAsBRL(feeData?.futureValueGross ?? 0)
  const futureValue = formatAsBRL(feeData?.futureValue ?? 0)
  const annualFee = (feeData ? feeData.annualIncomeFee * 100 : 0).toFixed(2)
  const annualRealFee = (
    feeData ? feeData?.realAnnualIncomeFee * 100 : 0
  ).toFixed(2)
  const periodInDays = feeData ? feeData?.periodInDays : 0
  const periodInBusinessDays = feeData ? feeData?.periodInBusinessDays : 0
  const investedAmount = formatAsBRL(feeData?.investedAmount ?? 0)
  const income = formatAsBRL(feeData?.income ?? 0)
  const taxAmount = formatAsBRL(
    chartData.find((data) => data.name === 'tax')?.amount ?? 0,
  )
  const tax = (feeData?.tax ?? 0) * 100
  const discountedIncome = formatAsBRL(feeData?.discountedIncome ?? 0)
  const realIncome = formatAsBRL(feeData?.realIncome ?? 0)

  const fee = ((feeData?.fee ?? 0) * 100).toFixed(2)

  const investmentAmount = formatCompact.format(
    chartData.reduce((accumulatorAmount, currentAmount) => {
      if (currentAmount.name !== 'tax') {
        return (accumulatorAmount += currentAmount.amount)
      }
      return accumulatorAmount
    }, 0),
  )

  return (
    <div className="flex w-[500px] flex-col gap-4">
      <CalcFormProvider
        onSubmit={handleSubmit(handleCalcFee)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="present-value">Quanto você tem hoje?</Label>
          <Input
            id="present-value"
            placeholder="0"
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
          <Label htmlFor="period">Daqui quanto tempo você precisa?</Label>
          <Input
            id="period"
            placeholder="0"
            inputMode="numeric"
            aria-invalid={fieldsState.period.error}
            {...register('period')}
            onChange={handleDigitsInputChange}
          >
            <InputUnit>{periodUnit}</InputUnit>
          </Input>
          <Label
            htmlFor="period"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.period.error}
          >
            {fieldsState.period.message}
          </Label>
        </div>

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

        <Button type="submit" className="w-full">
          Calcular
        </Button>

        <Box className="flex flex-col items-center justify-center">
          <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Você precisará de
          </h2>
          <strong className="font-mono text-5xl text-slate-700">{fee}</strong>
          <span className="text-muted-foreground">
            % ao {contributionPeriodUnit}
          </span>
        </Box>
      </CalcFormProvider>
      <div className="flex basis-1/2 flex-col">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] min-w-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <L
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {investmentAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reais
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center [&>*]:whitespace-nowrap"
            />
          </PieChart>
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
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            <TableRow className="flex flex-col [&_td]:border-b [&_td]:text-end">
              <TableCell>{presentValue}</TableCell>
              <TableCell className="h-[80px]">{futureValueGross}</TableCell>
              <TableCell>{futureValue}</TableCell>
              <TableCell>{annualFee}%</TableCell>
              <TableCell>{annualRealFee}%</TableCell>
              <TableCell>{periodInDays}</TableCell>
              <TableCell className="h-[80px]">{periodInBusinessDays}</TableCell>
              <TableCell>{investedAmount}</TableCell>
              <TableCell className="h-[80px]">{income}</TableCell>
              <TableCell className="h-[80px]">{taxAmount}</TableCell>
              <TableCell>{tax}%</TableCell>
              <TableCell className="h-[80px]">{discountedIncome}</TableCell>
              <TableCell>{realIncome}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
