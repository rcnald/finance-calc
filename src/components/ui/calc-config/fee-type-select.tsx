'use client'

import { ArrowDownUp, ArrowUpNarrowWide, Lock } from 'lucide-react'
import {
  ComponentProps,
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
} from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { cn } from '@/lib/utils'

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
import { Label } from '../label'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

export const FEE_TYPES = {
  pre: 'Pré-fixado',
  pos: 'Pós-fixado',
  indexed: 'Indexado',
} as const

const FEE_TYPES_ICONS = {
  pre: Lock,
  pos: ArrowDownUp,
  indexed: ArrowUpNarrowWide,
} as const

export type FeeType = keyof typeof FEE_TYPES

export const FeeTypeSchema = Object.keys(FEE_TYPES) as [FeeType]

export interface FeeTypeSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  id: string
}

export function FeeTypeSelect({
  value,
  onValueChange,
  id,
}: FeeTypeSelectProps) {
  const [feeTypeValue, setFeeTypeValue] = useState<FeeType>('pre')
  const [isFeeTypeOpen, setIsFeeTypeOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const actualValue = Object.keys(FEE_TYPES).includes(value ?? '')
    ? (value as FeeType)
    : feeTypeValue
  const SelectedFeeIcon = FEE_TYPES_ICONS[actualValue]

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value as FeeType)
    } else {
      setFeeTypeValue(value as FeeType)
    }
  }

  const handleRadioItemKeyUp: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      setIsFeeTypeOpen(false)
    }
  }

  const handleRadioItemClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseEvent = !(e.screenX === 0 && e.screenY === 0)

    if (isMouseEvent) {
      setIsFeeTypeOpen(false)
    }
  }

  return !isDesktop ? (
    <Drawer open={isFeeTypeOpen} onOpenChange={setIsFeeTypeOpen}>
      <DrawerTrigger
        id={id}
        className="flex h-6 w-fit items-center justify-between gap-1 rounded-md border border-input bg-background px-2 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-1"
      >
        <SelectedFeeIcon aria-hidden={true} size={12} />
        {FEE_TYPES[actualValue]}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Taxa</DrawerTitle>
          <DrawerDescription>Qual o tipo de taxa?</DrawerDescription>
        </DrawerHeader>
        <RadioGroup
          defaultValue="pre"
          value={actualValue}
          className="flex flex-col items-center justify-center gap-0"
          onValueChange={handleValueChange}
        >
          {Object.entries(FEE_TYPES).map(([key, value]) => {
            const Icon = FEE_TYPES_ICONS[key as FeeType]

            return (
              <FeeTypeSelectItem
                key={key}
                value={key}
                onKeyUp={handleRadioItemKeyUp}
                onClick={handleRadioItemClick}
              >
                <Icon aria-hidden={true} size={28} />
                <span className="font-normal">{value}</span>
              </FeeTypeSelectItem>
            )
          })}
        </RadioGroup>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Select
      defaultValue="pre"
      value={actualValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger id={id} className="h-6 w-fit px-2 py-0">
        <SelectValue placeholder="Pré-fixada" className="flex" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(FEE_TYPES).map(([key, value]) => {
          const Icon = FEE_TYPES_ICONS[key as FeeType]

          return (
            <SelectItem key={key} value={key}>
              <SelectIcon icon={<Icon size={12} />} />
              {value}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

interface FeeTypeSelectItemProps extends ComponentProps<'button'> {
  value: string
}

function FeeTypeSelectItem({
  onKeyUp,
  onClick,
  value,
  children,
  className,
  ...props
}: FeeTypeSelectItemProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center has-[button[data-state='checked']]:bg-accent",
        className,
      )}
    >
      <RadioGroupItem
        value={value}
        id={value}
        onKeyUp={onKeyUp}
        onClick={onClick}
        className="sr-only"
        {...props}
      />
      <Label
        htmlFor={value}
        className="flex w-44 scroll-m-20 justify-start gap-2 py-2 text-2xl tracking-tight transition-colors"
      >
        {children}
      </Label>
    </div>
  )
}
