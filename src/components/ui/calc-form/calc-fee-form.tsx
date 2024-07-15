'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEventHandler } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useQueryParams } from '@/hooks/useQueryParams'
import { filterDigits, formatToCurrency } from '@/lib/utils'

import { Button } from '../button'
import { CalcConfig } from '../calc-config'
import {
  INTERVAL,
  Interval,
  IntervalSchema,
  PLURAL_INTERVAL,
} from '../calc-config/interval-select'
import { Input, InputUnit } from '../input'
import { Label } from '../label'

export interface CalcFeeFormProps {}

const fieldSchema = z
  .string()
  .min(1, { message: 'campo obrigatório' })
  .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
  .refine((value) => value !== 0, { message: 'O valor não pode ser 0' })

const CalcFeeSchema = z.object({
  future_value: fieldSchema,
  present_value: fieldSchema,
  period: fieldSchema,
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
  period_interval: z.enum(IntervalSchema),
  tax: z.boolean(),
  cupom: z.boolean(),
  cupom_interval: z.enum(IntervalSchema).optional(),
})

export type CalcFeeSchema = z.infer<typeof CalcFeeSchema>

export type CalcFeeKeysSchema = keyof CalcFeeSchema

export type FieldsValidity = Record<
  keyof CalcFeeSchema,
  { error?: boolean; message?: string }
>

export function CalcFeeForm({ ...props }: CalcFeeFormProps) {
  const [periodInterval] = useQueryParams<Interval>(
    'period-interval',
    'month',
    IntervalSchema,
  )
  const [tax] = useQueryParams<boolean>('tax', false, [true, false])
  const [cupom] = useQueryParams<boolean>('cupom', false, [true, false])
  const [cupomInterval] = useQueryParams<Interval>(
    'cupom-interval',
    'month',
    IntervalSchema,
  )

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

  const fieldsKeys = Object.keys(CalcFeeSchema.shape) as [CalcFeeKeysSchema]

  const fields: FieldsValidity = fieldsKeys.reduce<FieldsValidity>(
    (acc, field) => {
      return {
        ...acc,
        [field]: {
          error: Boolean(errors[field]?.message),
          message: errors[field]?.message,
        },
      }
    },
    {} as FieldsValidity,
  )

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
        {...props}
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
          {fields.period.message ? (
            <span className="text-xs font-bold text-destructive">
              {fields.period.message}
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
            aria-invalid={fields.future_value.error}
            {...register('future_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          {fields.future_value.message ? (
            <span className="text-xs font-bold text-destructive">
              {fields.future_value.message}
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
            aria-invalid={fields.present_value.error}
            {...register('present_value')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
          </Input>
          {fields.present_value.message ? (
            <span className="text-xs font-bold text-destructive">
              {fields.present_value.message}
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
            aria-invalid={fields.contribution.error}
            {...register('contribution')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
            <InputUnit corner="right">
              Por {INTERVAL[periodInterval].toLocaleLowerCase()}
            </InputUnit>
          </Input>
          {fields.contribution.message ? (
            <span className="text-xs font-bold text-destructive">
              {fields.contribution.message}
            </span>
          ) : null}
        </div>
        <Button className="w-full">Calcular</Button>
      </form>
    </FormProvider>
  )
}
