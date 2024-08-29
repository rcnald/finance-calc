import { BENCHMARKS, FeeBenchmark, FeeType, Interval } from '@/lib/data'
import {
  calcGrossIncome,
  convertContributionToMonthly,
  convertFeeToAnnual,
  convertFeeToMonthly,
  convertIntervalPeriodToMonths,
  getTaxByPeriod,
  sumFees,
} from '@/lib/utils'

export interface GetFutureValueBody {
  present_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  period: number
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export interface GetFutureValueResponse {
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
    present_value: presentValue,
    period_interval: periodInterval,
    period,
    fee_type: feeType = 'pre',
    tax: isTax,
    contribution = 0,
    fee,
    benchmark,
  }: GetFutureValueBody = await request.json()

  const periodInMonths = convertIntervalPeriodToMonths(periodInterval, period)

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

  const futureValue =
    presentValue * (1 + monthlyFee) ** periodInMonths +
    (monthlyContribution * ((1 + monthlyFee) ** periodInMonths - 1)) /
      monthlyFee

  const investedAmount = presentValue + periodInMonths * monthlyContribution

  const income = calcGrossIncome({
    futureValue,
    period: periodInMonths,
    contribution: monthlyContribution,
    presentValue,
    tax: isTax ? getTaxByPeriod(periodInMonths * 30) : 0,
  })

  const futureValueGross = investedAmount + income

  const tax = isTax ? getTaxByPeriod(periodInMonths * 30) : 0
  const discountedIncome = income - income * tax

  const annualIncomeFee = convertFeeToAnnual('month', monthlyFee)
  const realAnnualIncomeFee = (1 + annualIncomeFee) / (1 + BENCHMARKS.ipca) - 1
  const realIncome = discountedIncome / (1 + BENCHMARKS.ipca)

  const futureValueResponse: GetFutureValueResponse = {
    presentValue: Number(presentValue.toFixed(2)),
    futureValueGross: Number(futureValueGross.toFixed(2)),
    futureValue: Number(futureValue.toFixed(2)),
    contribution: Number(contribution.toFixed(2)),
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

  if (benchmark) futureValueResponse.benchmark = benchmark

  if (isTax)
    futureValueResponse.discountedIncome = Number(discountedIncome.toFixed(2))
  if (isTax) futureValueResponse.tax = tax

  return Response.json(futureValueResponse)
}
