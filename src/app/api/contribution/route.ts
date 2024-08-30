import { BENCHMARKS, FeeBenchmark, FeeType, Interval } from '@/lib/data'
import {
  calcGrossIncome,
  convertFeeToAnnual,
  convertFeeToMonthly,
  convertIntervalPeriodToMonths,
  getTaxByPeriod,
  sumFees,
} from '@/lib/utils'

export interface GetContributionBody {
  present_value: number
  fee: number
  future_value: number
  period_interval: Interval
  period: number
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export interface GetContributionResponse {
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
    future_value: futureValue,
    period_interval: periodInterval,
    period,
    fee_type: feeType = 'pre',
    tax: isTax,
    fee,
    benchmark,
  }: GetContributionBody = await request.json()

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

  let contribution =
    (futureValue - presentValue * (1 + monthlyFee) ** periodInMonths) /
    (((1 + monthlyFee) ** periodInMonths - 1) / monthlyFee)

  const tax = isTax ? getTaxByPeriod(periodInMonths * 30) : 0

  const income = calcGrossIncome({
    futureValue,
    period: periodInMonths,
    contribution,
    presentValue,
    tax: isTax ? tax : 0,
  })

  let investedAmount = presentValue + periodInMonths * contribution

  const futureValueGross = investedAmount + income

  contribution =
    (futureValueGross - presentValue * (1 + monthlyFee) ** periodInMonths) /
    (((1 + monthlyFee) ** periodInMonths - 1) / monthlyFee)

  investedAmount = presentValue + periodInMonths * contribution

  investedAmount = presentValue + periodInMonths * contribution

  const discountedIncome = income - income * tax
  const annualIncomeFee = convertFeeToAnnual('month', monthlyFee)
  const realAnnualIncomeFee = (1 + annualIncomeFee) / (1 + BENCHMARKS.ipca) - 1
  const realIncome = discountedIncome / (1 + BENCHMARKS.ipca)

  const futureValueResponse: GetContributionResponse = {
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
