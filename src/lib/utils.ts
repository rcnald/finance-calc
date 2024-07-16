import { type ClassValue, clsx } from 'clsx'
import { FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { FeeIndexSchema, FeeTypeSchema, IntervalSchema } from './data'

export type FieldsValidity<
  T extends { [K in string]: number | string | boolean },
> = Record<keyof T, { error?: boolean; message?: string }>

export type GetFieldsStateParams<
  T extends { [K in string]: number | string | boolean },
> = {
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>
  errors: FieldErrors<T>
}

export type GetFieldsState<
  T extends { [K in string]: number | string | boolean },
> = (params: GetFieldsStateParams<T>) => FieldsValidity<T>

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

export function formatToCurrency(value: string) {
  const valueRaw = value.replace(/\D/g, '').replace(/^0+/, '')

  return valueRaw
    .padStart(3, '0')
    .replace(/(\d{2})$/, ',$1')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function filterDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function getFieldsState<
  T extends { [K in string]: number | string | boolean },
>({ schema, errors }: GetFieldsStateParams<T>): FieldsValidity<T> {
  const fieldsKeys = Object.keys(schema.shape) as [keyof T]

  const fields = fieldsKeys.reduce((acc, field) => {
    return {
      ...acc,
      [field]: {
        error: Boolean(errors[field]?.message),
        message: errors[field]?.message,
      },
    }
  }, {} as FieldsValidity<T>)

  return fields
}

export const ConfigSchema = z.object({
  fee_type: z.enum(FeeTypeSchema),
  benchmark: z.enum(FeeIndexSchema).optional(),
  period_interval: z.enum(IntervalSchema),
  tax: z.boolean(),
  cupom: z.boolean(),
  cupom_interval: z.enum(IntervalSchema).optional(),
})

export const FieldSchema = z
  .string()
  .min(1, { message: 'campo obrigatório' })
  .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
  .refine((value) => value !== 0, { message: 'O valor não pode ser 0' })
