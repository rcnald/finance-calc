import { type ClassValue, clsx } from 'clsx'
import { ChangeEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import {
  FeeBenchmarkSchema,
  FeeTypeSchema,
  halfYearInMonths,
  INTERVAL,
  Interval,
  IntervalSchema,
  IR,
  monthInMonths,
  PLURAL_INTERVAL,
  quarterInMonths,
  twoMonthsInMonths,
  yearInMonths,
} from './data'

export const ConfigSchema = z.object({
  fee_type: z.enum(FeeTypeSchema),
  benchmark: z.enum(FeeBenchmarkSchema).optional(),
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

export const getPeriod = (periodInterval: Interval) => {
  return INTERVAL[periodInterval]
}

export const getPeriodUnit = (periodInterval: Interval) => {
  return PLURAL_INTERVAL[periodInterval]
}

export function convertMonthlyPeriodToInterval(
  interval: Interval,
  periodInMonths: number,
) {
  let intervalInMonths = 0

  switch (interval) {
    case 'month':
      intervalInMonths = monthInMonths
      break
    case 'two-months':
      intervalInMonths = twoMonthsInMonths
      break
    case 'quarter':
      intervalInMonths = quarterInMonths
      break
    case 'half-year':
      intervalInMonths = halfYearInMonths
      break
    case 'year':
      intervalInMonths = yearInMonths
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return Math.ceil(periodInMonths / intervalInMonths)
}

export function convertContributionToMonthly(
  interval: Interval,
  contribution: number,
) {
  let intervalInMonths = 0

  switch (interval) {
    case 'month':
      intervalInMonths = monthInMonths
      break
    case 'two-months':
      intervalInMonths = twoMonthsInMonths
      break
    case 'quarter':
      intervalInMonths = quarterInMonths
      break
    case 'half-year':
      intervalInMonths = halfYearInMonths
      break
    case 'year':
      intervalInMonths = yearInMonths
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return contribution / intervalInMonths
}

export function convertFeeToMonthly(interval: Interval, fee: number) {
  let intervalInMonths = 0

  switch (interval) {
    case 'month':
      intervalInMonths = monthInMonths
      break
    case 'two-months':
      intervalInMonths = twoMonthsInMonths
      break
    case 'quarter':
      intervalInMonths = quarterInMonths
      break
    case 'half-year':
      intervalInMonths = halfYearInMonths
      break
    case 'year':
      intervalInMonths = yearInMonths
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return Math.pow(1 + fee, 1 / intervalInMonths) - 1
}

export function convertFeeToAnnual(interval: Interval, fee: number) {
  const monthlyFee = convertFeeToMonthly(interval, fee)
  return Math.pow(1 + monthlyFee, 12) - 1
}

export function getTaxByPeriod(days: number) {
  if (days <= 180) {
    return IR.bellow180days
  } else if (days <= 360) {
    return IR.between181and360days
  } else if (days <= 720) {
    return IR.between361and720days
  } else {
    return IR.above721days
  }
}

export function calcPeriodInMonths({
  futureValue,
  contribution,
  fee,
  presentValue,
}: {
  futureValue: number
  contribution: number
  fee: number
  presentValue: number
}) {
  const numerator = Math.log(
    (futureValue + contribution / fee) / (presentValue + contribution / fee),
  )
  const denominator = Math.log(1 + fee)

  return Number((numerator / denominator).toFixed(2))
}

export function calcGrossIncome({
  futureValue,
  period,
  contribution,
  presentValue,
  tax,
}: {
  futureValue: number
  period: number
  contribution: number
  presentValue: number
  tax?: number
}) {
  return (
    (futureValue - (period * contribution + presentValue)) / (1 - (tax ?? 0))
  )
}

export function convertIntervalToMonths(interval: Interval) {
  let intervalInMonths = 0

  switch (interval) {
    case 'month':
      intervalInMonths = monthInMonths
      break
    case 'two-months':
      intervalInMonths = twoMonthsInMonths
      break
    case 'quarter':
      intervalInMonths = quarterInMonths
      break
    case 'half-year':
      intervalInMonths = halfYearInMonths
      break
    case 'year':
      intervalInMonths = yearInMonths
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return intervalInMonths
}

export function calcCupomPayment(
  presentValue: number,
  monthlyFee: number,
  cupomIntervalInMonths: number,
): number {
  let currentPeriod = 0
  let cupomPayment = presentValue

  while (currentPeriod < cupomIntervalInMonths) {
    cupomPayment += cupomPayment * monthlyFee
    currentPeriod++
  }

  return cupomPayment - presentValue
}

export function calcCupomPaymentAmount(
  cupomPayment: number,
  cupomIntervalInMonths: number,
  income: number,
  hasTax?: boolean,
) {
  let cupomAmountDiscounted = 0
  let cupomAmount = 0
  let count = 0
  let periodInMonths = 0

  while (cupomAmountDiscounted <= income) {
    periodInMonths += cupomIntervalInMonths

    const tax = hasTax ? getTaxByPeriod(periodInMonths * 30) : 0

    cupomAmountDiscounted += cupomPayment - cupomPayment * tax

    cupomAmount += cupomPayment

    count += 1
  }

  const paymentAverage = cupomAmount / count

  return {
    cupomAmountDiscounted,
    cupomAmount,
    periodInMonths,
    paymentAverage,
  }
}

export function sumFees(fee1: number, fee2: number) {
  const result = (1 + fee1) * (1 + fee2) - 1
  return result
}

export function formatAsBRL(value: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
