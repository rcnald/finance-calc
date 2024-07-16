'use client'

import { z } from 'zod'

import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import { INTERVAL } from '@/lib/data'
import {
  ConfigSchema,
  FieldSchema,
  handleCurrencyInputChange,
} from '@/lib/utils'

import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { FeeInfoCard } from './fee-info-card'

const CalcPeriodSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  present_value: FieldSchema,
  fee: FieldSchema,
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
})

export type CalcPeriodSchema = z.infer<typeof CalcPeriodSchema>

export function PeriodForm() {
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcPeriodSchema>(CalcPeriodSchema)

  const { periodInterval, feeType } = useConfigParams()

  const { handleSubmit, register } = calcForm

  const handleCalcPeriod = (data: CalcPeriodSchema) => {
    console.log(data)
  }

  return (
    <CalcFormProvider
      onSubmit={handleSubmit(handleCalcPeriod)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="future-value"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quanto você precisa?
        </Label>
        <Input
          id="future-value"
          placeholder="0"
          inputMode="numeric"
          className="pl-12 font-semibold"
          aria-invalid={fieldsState.future_value.error}
          {...register('future_value')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit corner="left">R$</InputUnit>
        </Input>
        {fieldsState.future_value.message ? (
          <span className="text-xs font-bold text-destructive">
            {fieldsState.future_value.message}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="present-value"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Quanto você tem hoje?
          </Label>
        </div>
        <Input
          id="present-value"
          placeholder="0,00"
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="contribution"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Quanto você vai investir regularmente?
          </Label>
        </div>
        <Input
          id="contribution"
          placeholder="0,00"
          inputMode="numeric"
          className="pl-12 font-semibold"
          aria-invalid={fieldsState.contribution.error}
          {...register('contribution')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit corner="left">R$</InputUnit>
          <InputUnit corner="right">
            Por {INTERVAL[periodInterval].toLocaleLowerCase()}
          </InputUnit>
        </Input>
        {fieldsState.contribution.message ? (
          <span className="text-xs font-bold text-destructive">
            {fieldsState.contribution.message}
          </span>
        ) : null}
      </div>
      <Button className="w-full">Calcular</Button>
    </CalcFormProvider>
  )
}
