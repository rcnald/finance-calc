import {
  FeeBenchmark,
  FeeBenchmarkSchema,
  FeeType,
  FeeTypeSchema,
  Interval,
  IntervalSchema,
} from '@/lib/data'

import { useQueryParams } from './useQueryParams'

export const useConfigParams = () => {
  const [periodInterval] = useQueryParams<Interval>(
    'period-interval',
    'month',
    IntervalSchema,
  )
  const [benchmark] = useQueryParams<FeeBenchmark>(
    'fee-index',
    'cdi',
    FeeBenchmarkSchema,
  )
  const [feeType] = useQueryParams<FeeType>('fee-type', 'pre', FeeTypeSchema)
  const [tax] = useQueryParams<boolean>('tax', false)
  const [cupom] = useQueryParams<boolean>('cupom', false)
  const [cupomInterval] = useQueryParams<Interval>(
    'cupom-interval',
    'month',
    IntervalSchema,
  )

  return { periodInterval, benchmark, feeType, tax, cupom, cupomInterval }
}
