import { NextRequest, NextResponse } from 'next/server'

import { Interval } from '@/lib/data'
import {
  calculateRate,
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

  const tax = isTax ? getTaxByPeriod(periodInMonths * 30) : undefined

  const fee = calculateRate(
    presentValue,
    futureValue,
    contribution,
    period,
    tax,
  )

  return NextResponse.json({ fee }, { status: 200 })
}
