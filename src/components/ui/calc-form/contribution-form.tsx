'use client'

import { useState } from 'react'
import { z } from 'zod'

import { getContribution } from '@/api/getContribution'
import { GetContributionResponse } from '@/app/api/contribution/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { useIncomeChart } from '@/hooks/useIncomeChart'
import {
  ConfigSchema,
  FieldSchema,
  formatOutputValues,
  generateFieldsUnits,
  handleCurrencyInputChange,
  handleDigitsInputChange,
  OutputResponse,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { ReportTable } from '../report-table'
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

  const { IncomeChart } = useIncomeChart({
    discountedIncome: contributionData?.discountedIncome,
    income: contributionData?.income,
    investedAmount: contributionData?.investedAmount,
  })

  const { contributionPerInterval } = formatOutputValues<
    ContributionResponse | undefined
  >({
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
            Reais por {contributionPeriodUnit}
          </span>
        </Box>
      </CalcFormProvider>

      <div className="flex basis-1/2 flex-col">
        <IncomeChart />

        <ReportTable<ContributionResponse | undefined>
          reportData={contributionData}
        />
      </div>
    </div>
  )
}
