import axios from 'axios'

import { FeeBenchmark, FeeType, Interval } from '@/lib/data'
import { OutputResponse } from '@/lib/utils'

export type ContributionData = {
  fee_type: FeeType
  period_interval: Interval
  tax: boolean
  future_value: number
  period: number
  fee: number
  benchmark?: FeeBenchmark
  present_value?: number
}

export interface GetContributionPayload {
  period: number
  future_value: number
  fee: number
  present_value?: number
  period_interval: Interval
  fee_type: FeeType
  benchmark?: FeeBenchmark
  tax?: boolean
}

export async function getContribution<T extends OutputResponse>(
  contributionData: ContributionData,
) {
  const payload: GetContributionPayload = {
    period: contributionData.period,
    future_value: contributionData.future_value,
    fee: contributionData.fee,
    present_value: contributionData.present_value,
    period_interval: contributionData.period_interval,
    fee_type: contributionData.fee_type,
  }

  if (contributionData.fee_type !== 'pre') {
    payload.benchmark = contributionData.benchmark
  }
  if (contributionData.tax) payload.tax = contributionData.tax

  const payloadResponse = await axios.post<T>('/api/contribution', payload)

  return payloadResponse
}
