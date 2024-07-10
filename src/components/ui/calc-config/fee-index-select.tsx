'use client'

import { Activity, BadgeDollarSign, TicketPercent } from 'lucide-react'
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

const FEE_INDEX = {
  cdi: 'CDI',
  ipca: 'IPCA',
  selic: 'SELIC',
} as const

const FEE_INDEX_ICONS = {
  cdi: TicketPercent,
  ipca: Activity,
  selic: BadgeDollarSign,
} as const

type FeeIndexKeys = keyof typeof FEE_INDEX

export interface FeeIndexSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  id: string
}

export function FeeIndexSelect({
  value,
  onValueChange,
  id,
}: FeeIndexSelectProps) {
  const [feeIndexValue, setFeeIndexValue] = useState<FeeIndexKeys>('cdi')
  const [isFeeIndexOpen, setIsFeeIndexOpen] = useState(false)

  const actualValue =
    value !== undefined ? (value as FeeIndexKeys) : feeIndexValue

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value as FeeIndexKeys)
    } else {
      setFeeIndexValue(value as FeeIndexKeys)
    }
  }

  const handleRadioItemKeyUp: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      setIsFeeIndexOpen(false)
    }
  }

  const handleRadioItemClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseEvent = !(e.screenX === 0 && e.screenY === 0)

    if (isMouseEvent) {
      setIsFeeIndexOpen(false)
    }
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const SelectedFeeIcon = FEE_INDEX_ICONS[actualValue]

  return !isDesktop ? (
    <Drawer open={isFeeIndexOpen} onOpenChange={setIsFeeIndexOpen}>
      <DrawerTrigger
        id={id}
        className="flex h-6 w-fit items-center justify-between gap-1 rounded-md border border-input bg-background px-2 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-1"
      >
        <SelectedFeeIcon aria-hidden={true} size={12} />
        {FEE_INDEX[actualValue]}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Taxa</DrawerTitle>
          <DrawerDescription>Qual o índice de taxa?</DrawerDescription>
        </DrawerHeader>
        <RadioGroup
          defaultValue="pre"
          value={actualValue}
          className="flex flex-col items-center justify-center gap-0"
          onValueChange={handleValueChange}
        >
          {Object.entries(FEE_INDEX).map(([key, value]) => {
            const Icon = FEE_INDEX_ICONS[key as FeeIndexKeys]

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
      defaultValue="cdi"
      value={actualValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger id={id} className="h-6 w-fit px-2 py-0">
        <SelectValue placeholder="CDI" className="flex" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(FEE_INDEX).map(([key, value]) => {
          const Icon = FEE_INDEX_ICONS[key as FeeIndexKeys]

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
        className="flex w-32 scroll-m-20 justify-start gap-2 py-2 text-2xl tracking-tight transition-colors"
      >
        {children}
      </Label>
    </div>
  )
}
