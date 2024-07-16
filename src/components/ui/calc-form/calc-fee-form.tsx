'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEventHandler } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useConfigParams } from '@/hooks/useConfigParams'
import { INTERVAL, PLURAL_INTERVAL } from '@/lib/data'
import {
  ConfigSchema,
  FieldSchema,
  filterDigits,
  formatToCurrency,
  getFieldsState,
} from '@/lib/utils'

import { Button } from '../button'
import { CalcConfig } from '../calc-config'
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

export function CalcFeeForm() {
  const { periodInterval, tax, cupom, cupomInterval } = useConfigParams()

  const calcFeeForm = useForm<CalcFeeSchema>({
    resolver: zodResolver(CalcFeeSchema),
    defaultValues: {
      period_interval: periodInterval,
      tax: Boolean(tax),
      cupom: Boolean(cupom),
      cupom_interval: cupomInterval,
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = calcFeeForm

  const fieldsState = getFieldsState<CalcFeeSchema>({
    schema: CalcFeeSchema,
    errors,
  })

  const handleDigitsInputChange: ChangeEventHandler<HTMLInputElement> = (
    value,
  ) => (value.target.value = filterDigits(value.target.value))

  const handleCurrencyInputChange: ChangeEventHandler<HTMLInputElement> = (
    value,
  ) => (value.target.value = formatToCurrency(value.target.value))

  const handleCalcPeriod = (data: CalcFeeSchema) => {
    console.log(data)
  }

  return (
    <FormProvider {...calcFeeForm}>
      <form
        onSubmit={handleSubmit(handleCalcPeriod)}
        className="flex flex-col gap-4"
      >
        <CalcConfig />
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
            aria-invalid={fieldsState.future_value?.error}
            {...register('future_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          {fieldsState.future_value?.message ? (
            <span className="text-xs font-bold text-destructive">
              {fieldsState.future_value?.message}
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
            aria-invalid={fieldsState.present_value?.error}
            {...register('present_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          {fieldsState.present_value?.message ? (
            <span className="text-xs font-bold text-destructive">
              {fieldsState.present_value?.message}
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
            aria-invalid={fieldsState.contribution?.error}
            {...register('contribution')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
            <InputUnit corner="right">
              Por {INTERVAL[periodInterval].toLocaleLowerCase()}
            </InputUnit>
          </Input>
          {fieldsState.contribution?.message ? (
            <span className="text-xs font-bold text-destructive">
              {fieldsState.contribution?.message}
            </span>
          ) : null}
        </div>
        <Button className="w-full">Calcular</Button>
      </form>
    </FormProvider>
  )
}
