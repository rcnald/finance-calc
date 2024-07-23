import { BENCHMARKS, FeeIndex, FeeType, Interval } from '@/lib/data'
import {
  calcCupomPayment,
  calcCupomPaymentAmount,
  calcGrossIncome,
  calcPeriodInBusinessDays,
  convertBusinessDaysToCalendarDays,
  convertContributionPerDay,
  convertDailyPeriodToInterval,
  convertDaysToBusinessDays,
  convertFeeToDaily,
  convertIntervalToBusinessDays,
  getTaxByPeriod,
} from '@/lib/utils'

export interface GetPeriodBody {
  present_value: number
  future_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeIndex
  tax?: boolean
  cupom?: Interval
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
  cupomInterval?: Interval
  cupomPaymentAverage?: number
  income: number
  discountedIncome?: number
  tax?: number
  benchmark?: FeeIndex
  feeType: FeeType
}

export async function POST(request: Request) {
  const {
    future_value: futureValue,
    contribution = 0,
    present_value: presentValue,
    fee,
    benchmark,
    fee_type: feeType = 'pre',
    period_interval: periodInterval,
    tax: isTax,
    cupom,
  }: GetPeriodBody = await request.json()

  const benchmarkDailyFee = benchmark
    ? convertFeeToDaily('year', BENCHMARKS[benchmark])
    : 1

  const feeDaily = benchmark
    ? benchmarkDailyFee * fee
    : convertFeeToDaily(periodInterval, fee)
  const contributionDaily = convertContributionPerDay(
    periodInterval,
    contribution,
  )

  let periodInBusinessDays = 0
  let periodInDays = 0
  let income = 0
  let discountedIncome = 0
  let futureValueGross = 0
  let investedAmount = 0

  let periodResponse: GetPeriodResponse

  if (cupom) {
    const cupomIntervalInDays = convertIntervalToBusinessDays(cupom)
    const cupomIntervalInBusinessDays =
      convertDaysToBusinessDays(cupomIntervalInDays)

    const cupomPayment = calcCupomPayment(
      presentValue,
      feeDaily,
      cupomIntervalInBusinessDays,
    )

    income = futureValue - presentValue

    const {
      cupomAmount: cupomAmountDiscounted,
      periodInBusinessDays: periodBusiness,
      periodInDays: period,
      paymentAverage,
    } = calcCupomPaymentAmount(cupomPayment, cupomIntervalInDays, income, isTax)

    const { cupomAmount } = calcCupomPaymentAmount(
      cupomPayment,
      cupomIntervalInDays,
      income,
    )

    periodInBusinessDays = periodBusiness
    periodInDays = period
    investedAmount = presentValue + period * contribution
    income = cupomAmount
    discountedIncome = cupomAmountDiscounted
    futureValueGross = cupomAmount + presentValue

    periodResponse = {
      presentValue,
      futureValue: Number((cupomAmountDiscounted + presentValue).toFixed(2)),
      futureValueGross: Number(futureValueGross.toFixed(2)),
      fee,
      feeType,
      periodInDays,
      periodInBusinessDays,
      periodInterval,
      cupomInterval: cupom,
      cupomPaymentAverage: Number(paymentAverage.toFixed(2)),
      investedAmount: Number(investedAmount.toFixed(2)),
      income: Number(income.toFixed(2)),
    }

    if (benchmark) periodResponse.benchmark = benchmark

    if (isTax)
      periodResponse.discountedIncome = Number(discountedIncome.toFixed(2))

    return Response.json(periodResponse)
  }

  periodInBusinessDays = calcPeriodInBusinessDays({
    contribution: contributionDaily,
    fee: feeDaily,
    futureValue,
    presentValue,
  })

  periodInDays = convertBusinessDaysToCalendarDays(
    new Date(),
    periodInBusinessDays,
  )

  const tax = getTaxByPeriod(periodInDays)

  let period = convertDailyPeriodToInterval(periodInterval, periodInDays)

  income = calcGrossIncome({
    futureValue,
    period,
    contribution,
    presentValue,
    tax: isTax ? tax : 0,
  })

  futureValueGross = period * contribution + presentValue + income

  periodInBusinessDays = calcPeriodInBusinessDays({
    contribution: contributionDaily,
    fee: feeDaily,
    futureValue: futureValueGross,
    presentValue,
  })

  periodInDays = convertBusinessDaysToCalendarDays(
    new Date(),
    periodInBusinessDays,
  )

  period = convertDailyPeriodToInterval(periodInterval, periodInDays)

  income = calcGrossIncome({
    futureValue,
    period,
    contribution,
    presentValue,
  })

  if (isTax) income = income / (1 - tax)

  investedAmount = presentValue + period * contribution
  discountedIncome = income - income * tax
  futureValueGross = investedAmount + income

  periodResponse = {
    presentValue,
    futureValue,
    futureValueGross: Number(futureValueGross.toFixed(2)),
    contribution,
    fee,
    feeType,
    periodInDays,
    periodInBusinessDays,
    periodInterval,
    investedAmount: Number(investedAmount.toFixed(2)),
    income: Number(income.toFixed(2)),
  }

  if (benchmark) periodResponse.benchmark = benchmark

  if (isTax)
    periodResponse.discountedIncome = Number(discountedIncome.toFixed(2))
  if (isTax) periodResponse.tax = tax

  return Response.json(periodResponse)
}
