'use client'

import { useState } from 'react'
import { z } from 'zod'

import { getFee } from '@/api/getFee'
import { GetFeeResponse } from '@/app/api/fee/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { useIncomeChart } from '@/hooks/useIncomeChart'
import {
  ConfigSchema,
  FieldSchema,
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

const CalcFeeSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  present_value: FieldSchema,
  period: FieldSchema,
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
})

type CalcFeeSchema = z.infer<typeof CalcFeeSchema>

type FeeResponse = OutputResponse & GetFeeResponse

export function FeeForm() {
  const [feeData, setFeeData] = useState<FeeResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcFeeSchema>(CalcFeeSchema)

  const { periodInterval } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const { contributionPeriodUnit, periodUnit } = generateFieldsUnits({
    periodInterval,
  })

  const handleCalcFee = async (feeFormData: CalcFeeSchema) => {
    const { data: feeResponse } = await getFee<FeeResponse>(feeFormData)

    setFeeData(feeResponse)
  }

  const { IncomeChart } = useIncomeChart({
    discountedIncome: feeData?.discountedIncome,
    income: feeData?.income,
    investedAmount: feeData?.investedAmount,
  })

  const fee = ((feeData?.fee ?? 0) * 100).toFixed(2)

  return (
    <div className="flex flex-col gap-4">
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
        <IncomeChart />

        <ReportTable<FeeResponse | undefined> reportData={feeData} />
      </div>
    </div>
  )
}
