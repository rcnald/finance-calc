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

export interface GetPresentValueBody {
  future_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  period: number
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export interface GetPresentValueResponse {
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
    period_interval: periodInterval,
    period,
    fee_type: feeType = 'pre',
    tax: isTax,
    contribution = 0,
    fee,
    benchmark,
  }: GetPresentValueBody = await request.json()

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

  let presentValue = 0
  let income = 0
  let discountedIncome = 0
  let investedAmount = 0
  let annualIncomeFee = 0
  let realAnnualIncomeFee = 0
  let realIncome = 0

  const tax = getTaxByPeriod(periodInMonths * 30)

  presentValue =
    (futureValue -
      (monthlyContribution * ((1 + monthlyFee) ** periodInMonths - 1)) /
        monthlyFee) /
    (1 + monthlyFee) ** periodInMonths

  income = calcGrossIncome({
    futureValue,
    period: periodInMonths,
    contribution: monthlyContribution,
    presentValue,
    tax: isTax ? tax : 0,
  })

  investedAmount = presentValue + periodInMonths * monthlyContribution

  const futureValueGross = investedAmount + income

  discountedIncome = income - income * (isTax ? tax : 0)
  annualIncomeFee = convertFeeToAnnual('month', monthlyFee)
  realAnnualIncomeFee = (1 + annualIncomeFee) / (1 + BENCHMARKS.ipca) - 1
  realIncome = discountedIncome / (1 + BENCHMARKS.ipca)

  const presentValueResponse: GetPresentValueResponse = {
    presentValue: Number(presentValue.toFixed(2)),
    futureValueGross: Number(futureValueGross.toFixed(2)),
    futureValue,
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

  if (benchmark) presentValueResponse.benchmark = benchmark

  if (isTax)
    presentValueResponse.discountedIncome = Number(discountedIncome.toFixed(2))
  if (isTax) presentValueResponse.tax = tax

  return Response.json(presentValueResponse)
}
