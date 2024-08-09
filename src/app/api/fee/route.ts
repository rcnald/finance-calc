import { NextRequest, NextResponse } from 'next/server'

import { BENCHMARKS, Interval } from '@/lib/data'
import {
  calcGrossIncome,
  calculateRate,
  convertFeeToAnnual,
  convertIntervalPeriodToMonths,
  getTaxByPeriod,
} from '@/lib/utils'

export interface GetFeeBody {
  present_value: number
  future_value: number
  contribution: number
  period_interval: Interval
  period: number
  tax?: boolean
}

export interface GetFeeResponse {
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
  annualIncomeFee: number
  realAnnualIncomeFee: number
  realIncome: number
}

export async function POST(request: NextRequest) {
  const {
    contribution,
    future_value: futureValue,
    period,
    period_interval: periodInterval,
    present_value: presentValue,
    tax: isTax,
  }: GetFeeBody = await request.json()

  const periodInMonths = convertIntervalPeriodToMonths(periodInterval, period)

  const tax = isTax ? getTaxByPeriod(periodInMonths * 30) : 0

  const fee = calculateRate(
    presentValue,
    futureValue,
    contribution,
    period,
    tax,
  )

  let income = calcGrossIncome({
    futureValue,
    period,
    contribution,
    presentValue,
  })

  if (isTax) income = income / (1 - tax)
  const investedAmount = presentValue + period * contribution
  const futureValueGross = income + investedAmount
  const discountedIncome = income - income * (isTax ? tax : 0)
  const periodInDays = periodInMonths * 30
  const periodInBusinessDays = periodInMonths * 21
  const annualIncomeFee = convertFeeToAnnual(periodInterval, fee)
  const realAnnualIncomeFee = (1 + annualIncomeFee) / (1 + BENCHMARKS.ipca) - 1
  const realIncome = discountedIncome / (1 + BENCHMARKS.ipca)

  const feeResponse: GetFeeResponse = {
    presentValue,
    futureValue,
    contribution,
    fee,
    futureValueGross,
    income,
    discountedIncome,
    realIncome,
    investedAmount,
    periodInterval,
    periodInDays,
    periodInBusinessDays,
    tax,
    annualIncomeFee,
    realAnnualIncomeFee,
  }

  return NextResponse.json(feeResponse, { status: 200 })
}
