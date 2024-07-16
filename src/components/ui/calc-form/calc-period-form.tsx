'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEventHandler } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useConfigParams } from '@/hooks/useConfigParams'
import {
  FeeIndexSchema,
  FeeTypeSchema,
  INTERVAL,
  IntervalSchema,
} from '@/lib/data'
import { formatToCurrency } from '@/lib/utils'

import { Button } from '../button'
import { CalcConfig } from '../calc-config'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { FeeInfoCard } from './fee-info-card'

export interface CalcPeriodFormProps {}

const fieldSchema = z
  .string()
  .min(1, { message: 'campo obrigatório' })
  .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
  .refine((value) => value !== 0, { message: 'O valor não pode ser 0' })

const CalcPeriodSchema = z.object({
  future_value: fieldSchema,
  present_value: fieldSchema,
  fee: fieldSchema,
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.'))),
  fee_type: z.enum(FeeTypeSchema),
  benchmark: z.enum(FeeIndexSchema).optional(),
  period_interval: z.enum(IntervalSchema),
  tax: z.boolean(),
  cupom: z.boolean(),
  cupom_interval: z.enum(IntervalSchema).optional(),
})

export type CalcPeriodSchema = z.infer<typeof CalcPeriodSchema>

export type CalcPeriodKeysSchema = keyof CalcPeriodSchema

export type FieldsValidity = Record<
  keyof CalcPeriodSchema,
  { error?: boolean; message?: string }
>

export function CalcPeriodForm({ ...props }: CalcPeriodFormProps) {
  const { periodInterval, tax, cupom, cupomInterval, benchmark, feeType } =
    useConfigParams()

  const calcPeriodForm = useForm<CalcPeriodSchema>({
    resolver: zodResolver(CalcPeriodSchema),
    defaultValues: {
      fee_type: feeType,
      benchmark,
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
  } = calcPeriodForm

  const fieldsKeys = Object.keys(CalcPeriodSchema.shape) as [
    CalcPeriodKeysSchema,
  ]

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

  const handleCurrencyInputChange: ChangeEventHandler<HTMLInputElement> = (
    value,
  ) => (value.target.value = formatToCurrency(value.target.value))

  const handleCalcPeriod = (data: CalcPeriodSchema) => {
    console.log(data)
  }

  return (
    <FormProvider {...calcPeriodForm}>
      <form
        onSubmit={handleSubmit(handleCalcPeriod)}
        className="flex flex-col gap-4"
        {...props}
      >
        <CalcConfig />
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
            aria-invalid={fields.fee.error}
            {...register('fee')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit className="px-3">
              % a.{INTERVAL[periodInterval].toLocaleLowerCase()[0]}
            </InputUnit>
          </Input>
          {fields.fee.message ? (
            <span className="text-xs font-bold text-destructive">
              {fields.fee.message}
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
