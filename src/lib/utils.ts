import { type ClassValue, clsx } from 'clsx'
import { ChangeEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { ChartConfig } from '@/components/ui/chart'

import {
  FEE_BENCHMARK,
  FeeBenchmark,
  FeeBenchmarkSchema,
  FeeType,
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

export interface OutputResponse {
  presentValue: number
  futureValue: number
  futureValueGross: number
  annualIncomeFee: number
  realAnnualIncomeFee: number
  periodInDays: number
  periodInBusinessDays: number
  investedAmount: number
  income: number
  tax: number
  discountedIncome: number
  realIncome: number
}

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

export function convertIntervalPeriodToMonths(
  interval: Interval,
  period: number,
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

  return Math.ceil(period * intervalInMonths)
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

export function monthlyFeeToInterval(interval: Interval, monthlyFee: number) {
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

  return Math.pow(1 + monthlyFee, intervalInMonths) - 1
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

export const formatCompact = Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function calculateFutureValue(
  fee: number,
  presentValue: number,
  monthlyContribution: number,
  periodInMonths: number,
): number {
  let futureValue = presentValue * Math.pow(1 + fee, periodInMonths)

  for (let i = 1; i <= periodInMonths; i++) {
    futureValue += monthlyContribution * Math.pow(1 + fee, periodInMonths - i)
  }

  return futureValue
}

export function calculateRate(
  presentValue: number,
  futureValue: number,
  contribution: number,
  period: number,

  tax?: number,
) {
  let fee = 0.01
  const tolerance = 1e-10
  const maxIterations = 1000
  let iterations = 0

  const income = calcGrossIncome({
    futureValue,
    contribution,
    period,
    presentValue,
    tax,
  })

  const futureValueGross = income + contribution * period + presentValue

  while (iterations < maxIterations) {
    const possibleFutureValue = calculateFutureValue(
      fee,
      presentValue,
      contribution,
      period,
    )

    const futureValueDerivative =
      presentValue * period * Math.pow(1 + fee, period - 1) +
      contribution *
        ((period * Math.pow(1 + fee, period - 1) * fee -
          (Math.pow(1 + fee, period) - 1)) /
          Math.pow(fee, 2))

    const possibleFee =
      fee - (possibleFutureValue - futureValueGross) / futureValueDerivative

    if (Math.abs(possibleFee - fee) < tolerance) {
      fee = possibleFee
      break
    }

    fee = possibleFee
    iterations++
  }

  return fee
}

export function formatOutputValues<T extends OutputResponse | undefined>({
  data,
}: {
  data: T
}) {
  const presentValue = formatAsBRL(data?.presentValue ?? 0)
  const futureValueGross = formatAsBRL(data?.futureValueGross ?? 0)
  const futureValue = formatAsBRL(data?.futureValue ?? 0)
  const annualFee = (data ? data.annualIncomeFee * 100 : 0).toFixed(2)
  const annualRealFee = (data ? data?.realAnnualIncomeFee * 100 : 0).toFixed(2)
  const periodInDays = data ? data?.periodInDays : 0
  const periodInBusinessDays = data ? data?.periodInBusinessDays : 0
  const investedAmount = formatAsBRL(data?.investedAmount ?? 0)
  const income = formatAsBRL(data?.income ?? 0)

  const tax = (data?.tax ?? 0) * 100
  const discountedIncome = formatAsBRL(data?.discountedIncome ?? 0)
  const realIncome = formatAsBRL(data?.realIncome ?? 0)

  const { chartData } = getChartData({
    discountedIncome: data?.discountedIncome,
    income: data?.income ?? 0,
    investedAmount: data?.investedAmount ?? 0,
  })

  const taxAmount = formatAsBRL(
    chartData.find((chart) => chart.name === 'tax')?.amount ?? 0,
  )

  const investmentAmount = formatCompact.format(
    chartData.reduce((accumulatorAmount, currentAmount) => {
      if (currentAmount.name !== 'tax') {
        return (accumulatorAmount += currentAmount.amount)
      }
      return accumulatorAmount
    }, 0),
  )

  return {
    presentValue,
    futureValueGross,
    futureValue,
    annualFee,
    annualRealFee,
    periodInDays,
    periodInBusinessDays,
    investedAmount,
    income,
    tax,
    discountedIncome,
    realIncome,
    taxAmount,
    investmentAmount,
  }
}

export function getChartData({
  investedAmount,
  discountedIncome,
  income,
}: {
  investedAmount: number
  discountedIncome?: number
  income: number
}) {
  const chartData = [
    {
      name: 'invested',
      amount: investedAmount,
      fill: 'var(--color-invested)',
    },
    {
      name: 'income',
      amount: discountedIncome ?? income ?? 0,
      fill: 'var(--color-income)',
    },
    {
      name: 'tax',
      amount: discountedIncome ? income - discountedIncome : 0,
      fill: 'var(--color-tax)',
    },
  ]

  const chartConfig = {
    invested: {
      label: 'Valor investido',
      color: 'hsl(var(--chart-1))',
    },
    income: {
      label: 'Rendimento',
      color: 'hsl(var(--chart-2))',
    },
    tax: {
      label: 'Impostos',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  return { chartData, chartConfig }
}

export function generateFieldsUnits({
  periodInterval,
  benchmark,
  feeType,
}: {
  periodInterval: Interval
  benchmark?: FeeBenchmark
  feeType?: FeeType
}) {
  const feePeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()[0]
  const contributionPeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()
  const periodUnit = PLURAL_INTERVAL[periodInterval]
  const currentBenchmark = benchmark ? FEE_BENCHMARK[benchmark] : undefined
  const isFeeTypePre = feeType === 'pre'
  const feeUnit = isFeeTypePre ? `a.${feePeriodUnit}` : `do ${currentBenchmark}`

  return {
    feePeriodUnit,
    contributionPeriodUnit,
    periodUnit,
    feeUnit,
    currentBenchmark,
    isFeeTypePre,
  }
}
