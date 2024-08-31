import axios from 'axios'

import { FeeBenchmark, FeeType, Interval } from '@/lib/data'
import { OutputResponse } from '@/lib/utils'

export type PeriodData = {
  fee_type: FeeType
  period_interval: Interval
  tax: boolean
  future_value: number
  present_value: number
  fee: number
  benchmark?: FeeBenchmark
  contribution?: number
}

export interface GetPeriodPayload {
  present_value: number
  future_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export async function getPeriod<T extends OutputResponse>(
  periodData: PeriodData,
) {
  const payload: GetPeriodPayload = {
    present_value: periodData.present_value,
    future_value: periodData.future_value,
    fee: periodData.fee,
    contribution: periodData.contribution,
    period_interval: periodData.period_interval,
    fee_type: periodData.fee_type,
  }

  if (periodData.fee_type !== 'pre') {
    payload.benchmark = periodData.benchmark
  }
  if (periodData.tax) payload.tax = periodData.tax

  const payloadResponse = await axios.post<T>('/api/period', payload)

  return payloadResponse
}
