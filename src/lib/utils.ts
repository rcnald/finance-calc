import { type ClassValue, clsx } from 'clsx'
import { addDays, eachDayOfInterval, isWeekend } from 'date-fns'
import { ChangeEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import {
  FeeIndexSchema,
  FeeTypeSchema,
  halfYearInDays,
  INTERVAL,
  Interval,
  IntervalSchema,
  IR,
  monthInDays,
  PLURAL_INTERVAL,
  quarterInDays,
  twoMonthsInDays,
  yearInDays,
} from './data'

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

export const getPeriod = (periodInterval: Interval) => {
  return INTERVAL[periodInterval]
}

export const getPeriodUnit = (periodInterval: Interval) => {
  return PLURAL_INTERVAL[periodInterval]
}

export function convertDailyPeriodToInterval(
  interval: Interval,
  periodInDays: number,
) {
  let period = 0

  switch (interval) {
    case 'month':
      period = periodInDays / monthInDays
      break
    case 'two-months':
      period = periodInDays / twoMonthsInDays
      break
    case 'quarter':
      period = periodInDays / quarterInDays
      break
    case 'half-year':
      period = periodInDays / halfYearInDays
      break
    case 'year':
      period = periodInDays / yearInDays
      break
    default:
      throw new Error('Intervalo invalido')
  }

  return Math.ceil(period)
}

export function convertContributionPerDay(
  interval: Interval,
  contribution: number,
) {
  let intervalInDays = 0

  switch (interval) {
    case 'month':
      intervalInDays = monthInDays
      break
    case 'two-months':
      intervalInDays = twoMonthsInDays
      break
    case 'quarter':
      intervalInDays = quarterInDays
      break
    case 'half-year':
      intervalInDays = halfYearInDays
      break
    case 'year':
      intervalInDays = yearInDays
      break
    default:
      throw new Error('Intervalo invalido')
  }

  return contribution / intervalInDays
}

export function convertFeeToDaily(interval: Interval, fee: number) {
  let intervalInDays = 0

  switch (interval) {
    case 'month':
      intervalInDays = monthInDays
      break
    case 'two-months':
      intervalInDays = twoMonthsInDays
      break
    case 'quarter':
      intervalInDays = quarterInDays
      break
    case 'half-year':
      intervalInDays = halfYearInDays
      break
    case 'year':
      intervalInDays = yearInDays
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return Math.pow(1 + fee, 1 / intervalInDays) - 1
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

export function convertBusinessDaysToCalendarDays(
  startDate: Date,
  businessDays: number,
) {
  let calendarDays = 0
  let count = 0

  while (count < businessDays) {
    calendarDays++
    if (!isWeekend(addDays(startDate, calendarDays))) {
      count++
    }
  }

  return calendarDays
}

export function calcPeriodInBusinessDays({
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

  return Math.ceil(numerator / denominator)
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

export function convertDaysToBusinessDays(days: number): number {
  const endDate = addDays(new Date(), days)
  const allDays = eachDayOfInterval({ start: new Date(), end: endDate })
  const businessDays = allDays.filter((day) => !isWeekend(day))
  return businessDays.length
}

export function convertIntervalToBusinessDays(interval: Interval) {
  let intervalInDays

  switch (interval) {
    case 'month':
      intervalInDays = monthInDays
      break
    case 'two-months':
      intervalInDays = twoMonthsInDays
      break
    case 'quarter':
      intervalInDays = quarterInDays
      break
    case 'half-year':
      intervalInDays = halfYearInDays
      break
    case 'year':
      intervalInDays = yearInDays
      break
    default:
      throw new Error('Intervalo de período inválido')
  }

  return intervalInDays
}

export function calcCupomPayment(
  presentValue: number,
  feeDaily: number,
  cupomIntervalInDays: number,
): number {
  let currentPeriod = 0
  let cupomPayment = presentValue

  while (currentPeriod < cupomIntervalInDays) {
    cupomPayment += cupomPayment * feeDaily
    currentPeriod++
  }

  return cupomPayment - presentValue
}

export function calcCupomPaymentAmount(
  cupomPayment: number,
  cupomIntervalInDays: number,
  income: number,
  hasTax?: boolean,
) {
  const cupomIntervalInBusinessDays =
    convertDaysToBusinessDays(cupomIntervalInDays)

  let cupomAmount = 0
  let count = 0
  let periodInDays = 0
  let periodInBusinessDays = 0

  while (cupomAmount < income) {
    periodInDays += cupomIntervalInDays
    periodInBusinessDays += cupomIntervalInBusinessDays

    const tax = hasTax ? getTaxByPeriod(periodInDays) : 0

    cupomAmount += cupomPayment - cupomPayment * tax
    count += 1
  }

  const paymentAverage = cupomAmount / count

  return { cupomAmount, periodInDays, periodInBusinessDays, paymentAverage }
}
