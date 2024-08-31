import axios from 'axios'

import { FeeBenchmark, FeeType, Interval } from '@/lib/data'
import { OutputResponse } from '@/lib/utils'

export type FutureValueData = {
  fee_type: FeeType
  period_interval: Interval
  tax: boolean
  present_value: number
  period: number
  fee: number
  benchmark?: FeeBenchmark
  contribution?: number
}

export interface GetFutureValuePayload {
  period: number
  present_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export async function getFutureValue<T extends OutputResponse>(
  periodData: FutureValueData,
) {
  const payload: GetFutureValuePayload = {
    period: periodData.period,
    present_value: periodData.present_value,
    fee: periodData.fee,
    contribution: periodData.contribution,
    period_interval: periodData.period_interval,
    fee_type: periodData.fee_type,
  }

  if (periodData.fee_type !== 'pre') {
    payload.benchmark = periodData.benchmark
  }
  if (periodData.tax) payload.tax = periodData.tax

  const payloadResponse = await axios.post<T>('/api/future-value', payload)

  return payloadResponse
}
