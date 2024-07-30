'use client'

import { Activity, BadgeDollarSign, TicketPercent } from 'lucide-react'
import {
  ComponentProps,
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
} from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { FEE_BENCHMARK, FeeBenchmark } from '@/lib/data'
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

const FEE_BENCHMARK_ICONS: Record<FeeBenchmark, React.ElementType> = {
  cdi: TicketPercent,
  ipca: Activity,
  selic: BadgeDollarSign,
} as const

export interface FeeBenchmarkSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  id: string
}

export function FeeBenchmarkSelect({
  value,
  onValueChange,
  id,
}: FeeBenchmarkSelectProps) {
  const [feeBenchmarkValue, setFeeBenchmarkValue] =
    useState<FeeBenchmark>('cdi')
  const [isFeeBenchmarkOpen, setIsFeeBenchmarkOpen] = useState(false)

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const actualValue = Object.keys(FEE_BENCHMARK).includes(value ?? '')
    ? (value as FeeBenchmark)
    : feeBenchmarkValue
  const SelectedFeeIcon = FEE_BENCHMARK_ICONS[actualValue]
  const selectedBenchmark = FEE_BENCHMARK[actualValue]

  const Items = Object.entries(FEE_BENCHMARK).map(([key, value]) => {
    const icon = FEE_BENCHMARK_ICONS[key as FeeBenchmark]

    return { value: key as FeeBenchmark, placeholder: value, icon }
  })

  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value as FeeBenchmark)
    } else {
      setFeeBenchmarkValue(value as FeeBenchmark)
    }
  }

  const handleRadioItemKeyUp: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      setIsFeeBenchmarkOpen(false)
    }
  }

  const handleRadioItemClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseEvent = !(e.screenX === 0 && e.screenY === 0)

    if (isMouseEvent) {
      setIsFeeBenchmarkOpen(false)
    }
  }

  return !isDesktop ? (
    <Drawer open={isFeeBenchmarkOpen} onOpenChange={setIsFeeBenchmarkOpen}>
      <DrawerTrigger
        id={id}
        className="flex h-6 w-fit items-center justify-between gap-1 rounded-md border border-input bg-background px-2 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-1"
      >
        <SelectedFeeIcon aria-hidden={true} size={12} />
        {selectedBenchmark}
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
          {Items.map(({ value, placeholder, icon: Icon }) => {
            return (
              <FeeBenchmarkSelectItem
                key={value}
                value={value}
                onKeyUp={handleRadioItemKeyUp}
                onClick={handleRadioItemClick}
              >
                <Icon aria-hidden={true} size={28} />
                <span className="font-normal">{placeholder}</span>
              </FeeBenchmarkSelectItem>
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
        {Items.map(({ value, placeholder, icon: Icon }) => {
          return (
            <SelectItem key={value} value={value}>
              <SelectIcon icon={<Icon size={12} />} />
              {placeholder}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

interface FeeBenchmarkSelectItemProps extends ComponentProps<'button'> {
  value: string
}

function FeeBenchmarkSelectItem({
  onKeyUp,
  onClick,
  value,
  children,
  className,
  ...props
}: FeeBenchmarkSelectItemProps) {
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
