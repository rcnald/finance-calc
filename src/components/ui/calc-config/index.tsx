'use client'

import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { CalcMode, CalcModeSchema } from '@/app/page'
import { useQueryParams } from '@/hooks/useQueryParams'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible'
import { Label } from '../label'
import { Separator } from '../separator'
import { FeeIndex, FeeIndexSchema, FeeIndexSelect } from './fee-index-select'
import { FeeType, FeeTypeSchema, FeeTypeSelect } from './fee-type-select'
import { Interval, IntervalSchema, IntervalSelect } from './interval-select'

export interface CalcConfigProps {}

export function CalcConfig({ ...props }: CalcConfigProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

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
  const [feeIndex, setFeeIndex] = useQueryParams<FeeIndex>(
    'fee-index',
    'cdi',
    FeeIndexSchema,
  )
  const [periodInterval, setPeriodInterval] = useQueryParams<Interval>(
    'period-interval',
    'month',
    IntervalSchema,
  )
  const [cupom, setCupom] = useQueryParams<boolean>('cupom', false, [
    true,
    false,
  ])
  const [cupomInterval, setCupomInterval] = useQueryParams<Interval>(
    'cupom-interval',
    'month',
    IntervalSchema,
  )
  const [tax, setTax] = useQueryParams<boolean>('tax', false, [true, false])

  const CollapsibleTriggerIcon = isConfigOpen ? ChevronsDownUp : ChevronsUpDown

  return (
    <Collapsible
      open={isConfigOpen}
      onOpenChange={setIsConfigOpen}
      className="flex flex-col gap-2"
      {...props}
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
              htmlFor="fee"
              className="ml-1 text-sm font-medium leading-none"
            >
              Taxa
            </Label>
            <div className="flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-1">
              <Label htmlFor="fee-type" className="text-muted-foreground">
                Tipo
              </Label>

              <FeeTypeSelect
                id="fee-type"
                value={feeType}
                onValueChange={(value) => setFeeType(value as FeeType)}
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

                  <FeeIndexSelect
                    id="benchmark"
                    value={feeIndex}
                    onValueChange={(value) => setFeeIndex(value as FeeIndex)}
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

          <IntervalSelect
            id="period-interval"
            value={periodInterval}
            onValueChange={(value) => setPeriodInterval(value as Interval)}
            className="h-8 w-fit px-2"
          >
            <ChevronDown size={16} className="opacity-50" />
          </IntervalSelect>
        </div>

        <div>
          <Label className="ml-1 text-sm font-medium leading-none">
            Impostos
          </Label>
          <div className="flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <Checkbox
              id="tax"
              defaultChecked
              checked={Boolean(tax)}
              onCheckedChange={(value) => setTax(value as boolean)}
            />
            <Label htmlFor="tax" className="text-muted-foreground">
              Imposto de renda
            </Label>
          </div>
        </div>

        <div>
          <Label className="ml-1 text-sm font-medium leading-none">Cupom</Label>
          <div className="flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-1">
            <Checkbox
              id="cupom"
              checked={Boolean(cupom)}
              onCheckedChange={(value) => {
                setCupom(value as boolean)
              }}
            />
            <Label htmlFor="cupom" className="text-muted-foreground">
              Cupom de juros
            </Label>

            {cupom ? (
              <>
                <Separator orientation="vertical" className="h-5" />
                <Label
                  htmlFor="cupom-interval"
                  className="text-muted-foreground"
                >
                  Intervalo
                </Label>
                <IntervalSelect
                  id="cupom-interval"
                  value={cupomInterval}
                  onValueChange={(value) => setCupomInterval(value as Interval)}
                />
                <Label htmlFor="interval" className="text-muted-foreground">
                  <ChevronDown size={16} />
                </Label>
              </>
            ) : null}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
