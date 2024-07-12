'use client'

import { Info } from 'lucide-react'
import { ChangeEventHandler } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { filterDigits, formatToCurrency } from '@/lib/utils'

import { Button } from './button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { Input, InputUnit } from './input'
import { Label } from './label'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export interface CalcFormProps {}

export function CalcForm({ ...props }: CalcFormProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleCurrencyInputChange: ChangeEventHandler<HTMLInputElement> = (
    value,
  ) => (value.target.value = formatToCurrency(value.target.value))

  const handleDigitsInputChange: ChangeEventHandler<HTMLInputElement> = (
    value,
  ) => (value.target.value = filterDigits(value.target.value))

  return (
    <div {...props}>
      <div>
        <Label htmlFor="period">Daqui quanto tempo você precisa?</Label>
        <Input
          id="period"
          placeholder="0"
          inputMode="numeric"
          onChange={handleDigitsInputChange}
          className="font-semibold"
        >
          <InputUnit>Meses</InputUnit>
        </Input>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Label htmlFor="present-value">Quanto você tem hoje?</Label>
        </div>
        <Input
          id="present-value"
          placeholder="0,00"
          inputMode="numeric"
          onChange={handleCurrencyInputChange}
          className="pl-12 font-semibold"
        >
          <InputUnit corner="left">R$</InputUnit>
        </Input>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Label htmlFor="fee">Qual a taxa do seu investimento?</Label>
          {isDesktop ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Info size={16} />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Índice de referencia -{' '}
                  <span className="font-mono font-medium">CDI</span>
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

                  <span className="mt-6 font-mono text-4xl font-medium">
                    CDI
                  </span>

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
          )}
        </div>
        <Input
          id="fee"
          placeholder="0,00"
          inputMode="numeric"
          onChange={handleCurrencyInputChange}
          className="font-semibold"
        >
          <InputUnit className="px-3">%</InputUnit>
        </Input>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Label htmlFor="contribution">
            Quanto você vai investir regularmente?
          </Label>
        </div>
        <Input
          id="contribution"
          placeholder="0,00"
          inputMode="numeric"
          onChange={handleCurrencyInputChange}
          className="pl-12 font-semibold"
        >
          <InputUnit corner="left">R$</InputUnit>
          <InputUnit corner="right">Por mês</InputUnit>
        </Input>
      </div>

      <Button className="w-full">Calcular</Button>
    </div>
  )
}
