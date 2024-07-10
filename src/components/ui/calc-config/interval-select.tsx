'use client'

import {
  ComponentProps,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

const INTERVAL = {
  month: 'Mês',
  year: 'Ano',
  'half-year': 'Semestre',
  'two-months': 'Bimestre',
  quarter: 'Trimestre',
} as const

type IntervalKeys = keyof typeof INTERVAL

export interface IntervalSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  id: string
  children?: ReactNode
  className?: string
}

export function IntervalSelect({
  value,
  onValueChange,
  id,
  children,
  className,
}: IntervalSelectProps) {
  const [intervalValue, setIntervalValue] = useState<IntervalKeys>('month')
  const [isIntervalOpen, setIsIntervalOpen] = useState(false)

  const actualValue =
    value !== undefined ? (value as IntervalKeys) : intervalValue

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value as IntervalKeys)
    } else {
      setIntervalValue(value as IntervalKeys)
    }
  }

  const handleRadioItemKeyUp: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      setIsIntervalOpen(false)
    }
  }

  const handleRadioItemClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseEvent = !(e.screenX === 0 && e.screenY === 0)

    if (isMouseEvent) {
      setIsIntervalOpen(false)
    }
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')

  return !isDesktop ? (
    <Drawer open={isIntervalOpen} onOpenChange={setIsIntervalOpen}>
      <DrawerTrigger
        id={id}
        className={cn(
          'flex h-6 w-fit items-center justify-between gap-1 rounded-md border border-input bg-background px-2 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-1',
          className,
        )}
      >
        {INTERVAL[actualValue]}
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Período</DrawerTitle>
          <DrawerDescription>Qual a equivalência do período?</DrawerDescription>
        </DrawerHeader>
        <RadioGroup
          defaultValue="pre"
          value={actualValue}
          className="flex flex-col items-center justify-center gap-0"
          onValueChange={handleValueChange}
        >
          {Object.entries(INTERVAL).map(([key, value]) => {
            return (
              <IntervalSelectItem
                key={key}
                value={key}
                onKeyUp={handleRadioItemKeyUp}
                onClick={handleRadioItemClick}
              >
                <span className="font-normal">{value}</span>
              </IntervalSelectItem>
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
      defaultValue="month"
      value={actualValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger id={id} className={cn('h-6 w-fit px-2 py-0', className)}>
        <SelectValue placeholder="Mês" className="flex" />
        {children}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(INTERVAL).map(([key, value]) => {
          return (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

interface IntervalSelectItemProps extends ComponentProps<'button'> {
  value: string
}

function IntervalSelectItem({
  onKeyUp,
  onClick,
  value,
  children,
  className,
  ...props
}: IntervalSelectItemProps) {
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
        className="flex w-fit scroll-m-20 justify-start gap-2 py-2 text-2xl tracking-tight transition-colors"
      >
        {children}
      </Label>
    </div>
  )
}
