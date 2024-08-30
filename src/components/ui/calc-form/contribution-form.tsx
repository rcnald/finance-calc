'use client'

import { useState } from 'react'
import { Label as L, Pie, PieChart } from 'recharts'
import { z } from 'zod'

import { getContribution } from '@/api/getContribution'
import { GetContributionResponse } from '@/app/api/contribution/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import {
  ConfigSchema,
  FieldSchema,
  formatOutputValues,
  generateFieldsUnits,
  getChartData,
  handleCurrencyInputChange,
  handleDigitsInputChange,
  OutputResponse,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import {
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
import { FeeInfoCard } from './fee-info-card'

const CalcContributionSchema = ConfigSchema.extend({
  present_value: FieldSchema,
  future_value: FieldSchema,
  period: FieldSchema,
  fee: FieldSchema.transform((value) => value / 100),
})

export type CalcContributionSchema = z.infer<typeof CalcContributionSchema>

type ContributionResponse = OutputResponse & GetContributionResponse

export function ContributionForm() {
  const [contributionData, setContributionData] =
    useState<ContributionResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcContributionSchema>(CalcContributionSchema)

  const { periodInterval, feeType } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const { feePeriodUnit, periodUnit, contributionPeriodUnit } =
    generateFieldsUnits({
      feeType,
      periodInterval,
    })

  const handleCalcContribution = async (
    contributionFormFata: CalcContributionSchema,
  ) => {
    const { data: contributionResponse } =
      await getContribution<ContributionResponse>(contributionFormFata)

    setContributionData(contributionResponse)
  }

  const { chartConfig, chartData } = getChartData({
    discountedIncome: contributionData?.discountedIncome,
    income: contributionData?.income ?? 0,
    investedAmount: contributionData?.investedAmount ?? 0,
  })

  const {
    annualFee,
    annualRealFee,
    discountedIncome,
    futureValue,
    futureValueGross,
    income,
    investedAmount,
    periodInBusinessDays,
    periodInDays,
    presentValue,
    realIncome,
    tax,
    investmentAmount,
    taxAmount,
    contributionPerInterval,
  } = formatOutputValues<ContributionResponse | undefined>({
    data: contributionData,
  })

  return (
    <div className="flex flex-col gap-4">
      <CalcFormProvider
        onSubmit={handleSubmit(handleCalcContribution)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="present-value">Quanto você tem hoje?</Label>
          <Input
            id="present-value"
            placeholder="0"
            inputMode="numeric"
            aria-invalid={fieldsState.present_value.error}
            {...register('present_value', {
              onChange: handleCurrencyInputChange,
            })}
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
            {...register('future_value', {
              onChange: handleCurrencyInputChange,
            })}
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
            {...register('period', { onChange: handleDigitsInputChange })}
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
          <div className="flex items-center gap-2">
            <Label htmlFor="fee">Qual a taxa do seu investimento?</Label>
            {feeType !== 'pre' ? <FeeInfoCard /> : null}
          </div>
          <Input
            id="fee"
            placeholder="0,00"
            inputMode="numeric"
            className="font-semibold"
            aria-invalid={fieldsState.fee.error}
            {...register('fee', { onChange: handleCurrencyInputChange })}
          >
            <InputUnit className="px-3">% a.{feePeriodUnit}</InputUnit>
          </Input>
          <Label
            htmlFor="fee"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.fee.error}
          >
            {fieldsState.fee.message}
          </Label>
        </div>

        <Button className="w-full">Calcular</Button>

        <Box className="flex flex-col items-center justify-center">
          <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Você precisará aportar
          </h2>
          <strong className="font-mono text-5xl text-slate-700">
            {contributionPerInterval}
          </strong>
          <span className="text-muted-foreground">
            Reais ao {contributionPeriodUnit}
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
              <TableHead className="flex h-[80px] w-[150px] items-center p-4">
                Valor médio de cupom
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
              <TableCell className="h-[80px]">0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
