'use client'

import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { useQueryParams } from '@/hooks/useQueryParams'
import {
  CalcMode,
  CalcModeSchema,
  FeeBenchmark,
  FeeBenchmarkSchema,
  FeeType,
  FeeTypeSchema,
  Interval,
  IntervalSchema,
} from '@/lib/data'
import { ConfigSchemaType } from '@/lib/utils'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible'
import { Label } from '../label'
import { Separator } from '../separator'
import { FeeBenchmarkSelect } from './fee-benchmark-select'
import { FeeTypeSelect } from './fee-type-select'
import { IntervalSelect } from './interval-select'

export interface CalcConfigProps {
  open?: boolean
  onOpenChange?: (value: boolean) => void
}

export function CalcConfig({ open, onOpenChange }: CalcConfigProps) {
  const { control } = useFormContext<ConfigSchemaType>()

  const [calcMode] = useQueryParams<CalcMode>(
    'calc-mode',
    'period',
    CalcModeSchema,
  )
  const [feeType, setFeeType] = useQueryParams<FeeType>(
    'fee-type',
    'pre',
    FeeTypeSchema,
  )
  const [feeIndex, setFeeIndex] = useQueryParams<FeeBenchmark>(
    'fee-index',
    'cdi',
    FeeBenchmarkSchema,
  )
  const [periodInterval, setPeriodInterval] = useQueryParams<Interval>(
    'period-interval',
    'month',
    IntervalSchema,
  )
  const [tax, setTax] = useQueryParams<boolean>('tax', false)

  const CollapsibleTriggerIcon = open ? ChevronsDownUp : ChevronsUpDown

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Configurações
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-fit p-2 leading-none">
            <CollapsibleTriggerIcon size={16} />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="flex flex-wrap items-end gap-2">
        {calcMode === 'fee' ? null : (
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="fee-type"
              className="ml-1 text-sm font-medium leading-none"
            >
              Taxa
            </Label>
            <div className="flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-1">
              <Label htmlFor="fee-type" className="text-muted-foreground">
                Tipo
              </Label>

              <Controller
                control={control}
                name="fee_type"
                defaultValue={feeType}
                render={({ field }) => (
                  <FeeTypeSelect
                    id="fee-type"
                    value={feeType}
                    onValueChange={(value) => {
                      setFeeType(value as FeeType)
                      field.onChange(value)
                    }}
                  />
                )}
              />

              <Label htmlFor="fee-type" className="text-muted-foreground">
                <ChevronDown size={16} />
              </Label>

              {feeType !== 'pre' ? (
                <>
                  <Separator orientation="vertical" className="h-5" />

                  <Label htmlFor="benchmark" className="text-muted-foreground">
                    Índice
                  </Label>

                  <Controller
                    control={control}
                    name="benchmark"
                    defaultValue={feeIndex}
                    render={({ field }) => (
                      <FeeBenchmarkSelect
                        id="benchmark"
                        value={feeIndex}
                        onValueChange={(value) => {
                          setFeeIndex(value as FeeBenchmark)
                          field.onChange(value)
                        }}
                      />
                    )}
                  />

                  <Label htmlFor="benchmark" className="text-muted-foreground">
                    <ChevronDown size={16} />
                  </Label>
                </>
              ) : null}
            </div>
          </div>
        )}

        <div>
          <Label
            htmlFor="period-interval"
            className="ml-1 text-sm font-medium leading-none"
          >
            Prazo
          </Label>

          <Controller
            control={control}
            name="period_interval"
            defaultValue={periodInterval}
            render={({ field }) => (
              <IntervalSelect
                id="period-interval"
                value={periodInterval}
                onValueChange={(value) => {
                  setPeriodInterval(value as Interval)
                  field.onChange(value)
                }}
                className="h-8 w-fit px-2"
              >
                <ChevronDown size={16} className="opacity-50" />
              </IntervalSelect>
            )}
          />
        </div>
        {calcMode !== 'present-value' ? (
          <div>
            <Label
              htmlFor="tax"
              className="ml-1 text-sm font-medium leading-none"
            >
              Impostos
            </Label>
            <div className="flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
              <Controller
                control={control}
                name="tax"
                defaultValue={tax}
                render={({ field }) => (
                  <Checkbox
                    id="tax"
                    defaultChecked
                    checked={tax}
                    onCheckedChange={(value) => {
                      setTax(value as boolean)
                      field.onChange(value)
                    }}
                  />
                )}
              />

              <Label htmlFor="tax" className="text-muted-foreground">
                Imposto de renda
              </Label>
            </div>
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  )
}
