import { Info } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import { useQueryParams } from '@/hooks/useQueryParams'
import {
  BENCHMARKS,
  FEE_BENCHMARK,
  FeeBenchmark,
  FeeBenchmarkSchema,
} from '@/lib/data'

import { Button } from '../button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'

export function FeeInfoCard() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [feeIndex] = useQueryParams<FeeBenchmark>(
    'fee-index',
    'cdi',
    FeeBenchmarkSchema,
  )

  const currentBenchmark = FEE_BENCHMARK[feeIndex]
  const currentBenchmarkFee = BENCHMARKS[feeIndex] * 100

  return isDesktop ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Info size={16} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Índice de referencia -{' '}
          <span className="font-mono font-medium">{currentBenchmark}</span>
          <span> - {currentBenchmarkFee}% a.a</span>
        </p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <span>
          <Info size={16} />
        </span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Índice de referencia</DrawerTitle>
          <DrawerDescription>
            índice que será usado como base para os cálculos
          </DrawerDescription>

          <span className="mt-6 font-mono text-4xl font-medium">CDI</span>
          <span> {currentBenchmarkFee}% a.a</span>

          <DrawerFooter>
            <DrawerClose>
              <Button variant="secondary" className="w-full">
                Fechar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
