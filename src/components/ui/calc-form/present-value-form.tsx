'use client'

import { useState } from 'react'
import { z } from 'zod'

import { getPresentValue } from '@/api/getPresentValue'
import { GetPresentValueResponse } from '@/app/api/present-value/route'
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

const CalcPresentValueSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  period: FieldSchema,
  fee: FieldSchema.transform((value) => value / 100),
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
})

export type CalcPresentValueSchema = z.infer<typeof CalcPresentValueSchema>

type PresentValueResponse = OutputResponse & GetPresentValueResponse

export function PresentValueForm() {
  const [presentValueData, setPresentValueData] =
    useState<PresentValueResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcPresentValueSchema>(CalcPresentValueSchema)

  const { periodInterval, feeType } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const { contributionPeriodUnit, feePeriodUnit, periodUnit } =
    generateFieldsUnits({ feeType, periodInterval })

  const handleCalcPresentValue = async (data: CalcPresentValueSchema) => {
    const { data: presentValueResponse } =
      await getPresentValue<PresentValueResponse>(data)

    setPresentValueData(presentValueResponse)
  }

  const { IncomeChart } = useIncomeChart({
    discountedIncome: presentValueData?.discountedIncome,
    income: presentValueData?.income,
    investedAmount: presentValueData?.investedAmount,
  })

  const { presentValue } = formatOutputValues<PresentValueResponse | undefined>(
    {
      data: presentValueData,
    },
  )

  return (
    <div className="flex flex-col gap-4">
      <CalcFormProvider
        onSubmit={handleSubmit(handleCalcPresentValue)}
        className="flex flex-col gap-4"
      >
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="contribution">
            Quanto você vai investir regularmente?
          </Label>
          <Input
            id="contribution"
            placeholder="0,00"
            inputMode="numeric"
            aria-invalid={fieldsState.contribution.error}
            {...register('contribution', {
              onChange: handleCurrencyInputChange,
            })}
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
        <Button className="w-full">Calcular</Button>

        <Box className="flex flex-col items-center justify-center">
          <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
            Você precisará de
          </h2>
          <strong className="font-mono text-5xl text-slate-700">
            {presentValue}
          </strong>
          <span className="text-muted-foreground">Reais</span>
        </Box>
      </CalcFormProvider>

      <div className="flex basis-1/2 flex-col">
        <IncomeChart />

        <ReportTable<PresentValueResponse | undefined>
          reportData={presentValueData}
        />
      </div>
    </div>
  )
}
