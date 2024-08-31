'use client'

import { useState } from 'react'
import { z } from 'zod'

import { getPeriod } from '@/api/getPeriod'
import type { GetPeriodResponse } from '@/app/api/period/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { useIncomeChart } from '@/hooks/useIncomeChart'
import {
  ConfigSchema,
  convertMonthlyPeriodToInterval,
  FieldSchema,
  generateFieldsUnits,
  handleCurrencyInputChange,
  OutputResponse,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { ReportTable } from '../report-table'
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

type PeriodResponse = OutputResponse & GetPeriodResponse

export function PeriodForm() {
  const [periodData, setPeriodData] = useState<PeriodResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcPeriodSchema>(CalcPeriodSchema)

  const { periodInterval, feeType, benchmark } = useConfigParams()

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = calcForm

  const { contributionPeriodUnit, feeUnit, isFeeTypePre, periodUnit } =
    generateFieldsUnits({ benchmark, feeType, periodInterval })

  const handleCalcPeriod = async (periodFormData: CalcPeriodSchema) => {
    const { data: periodResponse } =
      await getPeriod<PeriodResponse>(periodFormData)

    setPeriodData(periodResponse)
  }

  const { IncomeChart } = useIncomeChart({
    discountedIncome: periodData?.discountedIncome,
    income: periodData?.income,
    investedAmount: periodData?.investedAmount,
  })

  const period = periodData
    ? convertMonthlyPeriodToInterval(
        periodData.periodInterval,
        periodData.periodInDays / 30,
      )
    : 0

  return (
    <div className="flex flex-col gap-4">
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
            <InputUnit className="px-3">% {feeUnit}</InputUnit>
          </Input>
          <Label
            htmlFor="fee"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.fee.error}
          >
            {fieldsState.fee.message}
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

        <Button className="w-full" disabled={isSubmitting}>
          Calcular
        </Button>

        <Box className="flex flex-col items-center justify-center">
          <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Você precisará de
          </h2>
          <strong className="font-mono text-5xl text-slate-700">
            {period}
          </strong>
          <span className="text-muted-foreground">{periodUnit}</span>
        </Box>
      </CalcFormProvider>

      <div className="flex basis-1/2 flex-col">
        <IncomeChart />

        <ReportTable<PeriodResponse | undefined> reportData={periodData} />
      </div>
    </div>
  )
}
