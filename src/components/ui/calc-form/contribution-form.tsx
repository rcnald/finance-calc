'use client'

import { z } from 'zod'

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
import { FeeInfoCard } from './fee-info-card'

const CalcContributionSchema = ConfigSchema.extend({
  present_value: FieldSchema,
  future_value: FieldSchema,
  period: FieldSchema,
  fee: FieldSchema,
})

export type CalcContributionSchema = z.infer<typeof CalcContributionSchema>

export function ContributionForm() {
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcContributionSchema>(CalcContributionSchema)

  const { periodInterval, feeType } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const feePeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()[0]
  const periodUnit = getPeriodUnit(periodInterval)

  const handleCalcContribution = (data: CalcContributionSchema) => {
    console.log(data)
  }

  return (
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
    </CalcFormProvider>
  )
}
