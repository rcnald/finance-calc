import { type ClassValue, clsx } from 'clsx'
import { ChangeEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { FeeIndexSchema, FeeTypeSchema, IntervalSchema } from './data'

export const ConfigSchema = z.object({
  fee_type: z.enum(FeeTypeSchema),
  benchmark: z.enum(FeeIndexSchema).optional(),
  period_interval: z.enum(IntervalSchema),
  tax: z.boolean(),
  cupom: z.boolean(),
  cupom_interval: z.enum(IntervalSchema).optional(),
})

export type ConfigSchemaType = z.infer<typeof ConfigSchema>

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

export const FieldSchema = z
  .string()
  .min(1, { message: 'campo obrigatório' })
  .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
  .refine((value) => value !== 0, { message: 'O valor não pode ser 0' })

export const handleDigitsInputChange: ChangeEventHandler<HTMLInputElement> = (
  value,
) => (value.target.value = filterDigits(value.target.value))

export const handleCurrencyInputChange: ChangeEventHandler<HTMLInputElement> = (
  value,
) => (value.target.value = formatToCurrency(value.target.value))
