import { BENCHMARKS, FeeBenchmark, FeeType, Interval } from '@/lib/data'
import {
  calcGrossIncome,
  calcPeriodInMonths,
  convertContributionToMonthly,
  convertFeeToAnnual,
  convertFeeToMonthly,
  convertMonthlyPeriodToInterval,
  getTaxByPeriod,
  sumFees,
} from '@/lib/utils'

export interface GetPeriodBody {
  present_value: number
  future_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export interface GetPeriodResponse {
  presentValue: number
  futureValue: number
  futureValueGross: number
  contribution?: number
  fee: number
  periodInDays: number
  periodInBusinessDays: number
  periodInterval: Interval
  investedAmount: number
  income: number
  discountedIncome?: number
  tax?: number
  benchmark?: FeeBenchmark
  feeType: FeeType
  annualIncomeFee: number
  realAnnualIncomeFee: number
  realIncome: number
}

export async function POST(request: Request) {
  const {
    future_value: futureValue,
    present_value: presentValue,
    period_interval: periodInterval,
    fee_type: feeType = 'pre',
    tax: isTax,
    contribution = 0,
    fee,
    benchmark,
  }: GetPeriodBody = await request.json()

  const monthlyBenchmarkFee = benchmark
    ? convertFeeToMonthly('year', BENCHMARKS[benchmark])
    : 1

  let monthlyFee

  switch (feeType) {
    case 'indexed':
      monthlyFee = sumFees(
        convertFeeToMonthly(periodInterval, fee),
        monthlyBenchmarkFee,
      )
      break
    case 'pos':
      monthlyFee = fee * monthlyBenchmarkFee
      break
    case 'pre':
      monthlyFee = convertFeeToMonthly(periodInterval, fee)
      break
  }

  const monthlyContribution = convertContributionToMonthly(
    periodInterval,
    contribution,
  )

  let periodInMonths = 0
  let income = 0
  let discountedIncome = 0
  let futureValueGross = 0
  let investedAmount = 0
  let annualIncomeFee = 0
  let realAnnualIncomeFee = 0
  let realIncome = 0

  periodInMonths = calcPeriodInMonths({
    contribution: monthlyContribution,
    fee: monthlyFee,
    futureValue,
    presentValue,
  })

  const tax = getTaxByPeriod(periodInMonths * 30)

  let period = convertMonthlyPeriodToInterval(periodInterval, periodInMonths)

  income = calcGrossIncome({
    futureValue,
    period,
    contribution,
    presentValue,
    tax: isTax ? tax : 0,
  })

  futureValueGross = period * contribution + presentValue + income

  periodInMonths = calcPeriodInMonths({
    contribution: monthlyContribution,
    fee: monthlyFee,
    futureValue: futureValueGross,
    presentValue,
  })

  period = convertMonthlyPeriodToInterval(periodInterval, periodInMonths)

  income = calcGrossIncome({
    futureValue,
    period,
    contribution,
    presentValue,
  })

  if (isTax) income = income / (1 - tax)

  investedAmount = presentValue + period * contribution
  discountedIncome = income - income * (isTax ? tax : 0)
  futureValueGross = investedAmount + income
  annualIncomeFee = convertFeeToAnnual('month', monthlyFee)
  realAnnualIncomeFee = (1 + annualIncomeFee) / (1 + BENCHMARKS.ipca) - 1
  realIncome = discountedIncome / (1 + BENCHMARKS.ipca)

  const periodResponse: GetPeriodResponse = {
    presentValue,
    futureValue,
    futureValueGross: Number(futureValueGross.toFixed(2)),
    contribution,
    fee: Number(fee.toFixed(4)),
    annualIncomeFee: Number(annualIncomeFee.toFixed(4)),
    realAnnualIncomeFee: Number(realAnnualIncomeFee.toFixed(4)),
    feeType,
    periodInDays: Math.floor(periodInMonths * 30),
    periodInBusinessDays: Math.floor(periodInMonths * 21),
    periodInterval,
    investedAmount: Number(investedAmount.toFixed(2)),
    income: Number(income.toFixed(2)),
    realIncome: Number(realIncome.toFixed(2)),
  }

  if (benchmark) periodResponse.benchmark = benchmark

  if (isTax)
    periodResponse.discountedIncome = Number(discountedIncome.toFixed(2))
  if (isTax) periodResponse.tax = tax

  return Response.json(periodResponse)
}
