import axios from 'axios'

import { FeeBenchmark, FeeType, Interval } from '@/lib/data'
import { OutputResponse } from '@/lib/utils'

export type PresentValueData = {
  fee_type: FeeType
  period_interval: Interval
  tax: boolean
  cupom: boolean
  future_value: number
  period: number
  fee: number
  benchmark?: FeeBenchmark
  cupom_interval?: Interval
  contribution?: number
}

export interface GetPresentValuePayload {
  period: number
  future_value: number
  fee: number
  contribution?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
  cupom?: Interval
}

export async function getPresentValue<T extends OutputResponse>(
  periodData: PresentValueData,
) {
  const payload: GetPresentValuePayload = {
    period: periodData.period,
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
  if (periodData.cupom) payload.cupom = periodData.cupom_interval

  const payloadResponse = await axios.post<T>('/api/present-value', payload)

  return payloadResponse
}
