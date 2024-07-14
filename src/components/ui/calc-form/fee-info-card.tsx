import { Info } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'

import { useQueryParams } from '@/hooks/useQueryParams'

import { Button } from '../button'
import {
  FEE_INDEX,
  FeeIndex,
  FeeIndexSchema,
} from '../calc-config/fee-index-select'
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

  const [feeIndex] = useQueryParams<FeeIndex>(
    'fee-index',
    'cdi',
    FeeIndexSchema,
  )

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
          <span className="font-mono font-medium">{FEE_INDEX[feeIndex]}</span>
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
