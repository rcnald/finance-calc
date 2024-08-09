'use client'

import axios from 'axios'
import { z } from 'zod'

import { GetFeeBody } from '@/app/api/fee/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import {
  ConfigSchema,
  FieldSchema,
  getPeriod,
  getPeriodUnit,
  handleCurrencyInputChange,
  handleDigitsInputChange,
} from '@/lib/utils'

import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'

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

    console.log(data)
  }

  return (
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
          {...register('future_value', { onChange: handleCurrencyInputChange })}
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
        <Label htmlFor="contribution">
          Quanto você vai investir regularmente?
        </Label>
        <Input
          id="contribution"
          placeholder="0,00"
          inputMode="numeric"
          aria-invalid={fieldsState.contribution.error}
          {...register('contribution', { onChange: handleCurrencyInputChange })}
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
    </CalcFormProvider>
  )
}
