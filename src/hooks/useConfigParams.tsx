import {
  FeeIndex,
  FeeIndexSchema,
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
  const [benchmark] = useQueryParams<FeeIndex>(
    'fee-index',
    'cdi',
    FeeIndexSchema,
  )
  const [feeType] = useQueryParams<FeeType>('fee-type', 'pre', FeeTypeSchema)
  const [tax] = useQueryParams<boolean>('tax', false, [true, false])
  const [cupom] = useQueryParams<boolean>('cupom', false, [true, false])
  const [cupomInterval] = useQueryParams<Interval>(
    'cupom-interval',
    'month',
    IntervalSchema,
  )

  return { periodInterval, benchmark, feeType, tax, cupom, cupomInterval }
}
