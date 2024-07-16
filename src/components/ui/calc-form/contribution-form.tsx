'use client'

import { z } from 'zod'

import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { INTERVAL, PLURAL_INTERVAL } from '@/lib/data'
import {
  ConfigSchema,
  FieldSchema,
  handleCurrencyInputChange,
  handleDigitsInputChange,
} from '@/lib/utils'

import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { FeeInfoCard } from './fee-info-card'

const CalcContributionSchema = ConfigSchema.extend({
  present_value: FieldSchema,
  period: FieldSchema,
  fee: FieldSchema,
})

export type CalcContributionSchema = z.infer<typeof CalcContributionSchema>

export function ContributionForm() {
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcContributionSchema>(CalcContributionSchema)

  const { periodInterval, feeType } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const handleCalcContribution = (data: CalcContributionSchema) => {
    console.log(data)
  }

  return (
    <CalcFormProvider
      onSubmit={handleSubmit(handleCalcContribution)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="present-value"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quanto você tem hoje?
        </Label>
        <Input
          id="present-value"
          placeholder="0"
          inputMode="numeric"
          className="pl-12 font-semibold"
          aria-invalid={fieldsState.present_value.error}
          {...register('present_value')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit corner="left">R$</InputUnit>
        </Input>
        {fieldsState.present_value.message ? (
          <span className="text-xs font-bold text-destructive">
            {fieldsState.present_value.message}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="period"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Daqui quanto tempo você precisa?
        </Label>
        <Input
          id="period"
          placeholder="0"
          inputMode="numeric"
          className="font-semibold"
          {...register('period')}
          onChange={handleDigitsInputChange}
        >
          <InputUnit>{PLURAL_INTERVAL[periodInterval]}</InputUnit>
        </Input>
        {fieldsState.period?.message ? (
          <span className="text-xs font-bold text-destructive">
            {fieldsState.period?.message}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="fee"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Qual a taxa do seu investimento?
          </Label>
          {feeType !== 'pre' ? <FeeInfoCard /> : null}
        </div>
        <Input
          id="fee"
          placeholder="0,00"
          inputMode="numeric"
          className="font-semibold"
          aria-invalid={fieldsState.fee.error}
          {...register('fee')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit className="px-3">
            % a.{INTERVAL[periodInterval].toLocaleLowerCase()[0]}
          </InputUnit>
        </Input>
        {fieldsState.fee.message ? (
          <span className="text-xs font-bold text-destructive">
            {fieldsState.fee.message}
          </span>
        ) : null}
      </div>

      <Button className="w-full">Calcular</Button>
    </CalcFormProvider>
  )
}
