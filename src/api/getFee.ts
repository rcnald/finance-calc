import axios from 'axios'

import { FeeBenchmark, FeeType, Interval } from '@/lib/data'
import { OutputResponse } from '@/lib/utils'

export type FeeData = {
  period: number
  present_value: number
  future_value: number
  contribution: number
  period_interval: Interval
  fee_type: FeeType
  tax: boolean
  benchmark?: FeeBenchmark
}

export interface GetFeePayload {
  present_value: number
  future_value: number
  contribution: number
  period_interval: Interval
  period: number
  tax?: boolean
}

export async function getFee<T extends OutputResponse>(feeData: FeeData) {
  const payload: GetFeePayload = {
    present_value: feeData.present_value,
    future_value: feeData.future_value,
    contribution: feeData.contribution,
    period: feeData.period,
    period_interval: feeData.period_interval,
  }

  if (feeData.tax) payload.tax = feeData.tax

  const payloadResponse = await axios.post<T>('/api/fee', payload)

  return payloadResponse
}
