'use client'

import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible'
import { Label } from '../label'
import { Separator } from '../separator'
import { FeeIndexSelect } from './fee-index-select'
import { FeeTypeSelect } from './fee-type-select'
import { IntervalSelect } from './interval-select'

export interface CalcConfigProps {}

export function CalcConfig({ ...props }: CalcConfigProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)

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

      <CollapsibleContent>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="fee"
              className="ml-1 text-sm font-medium leading-none"
            >
              Taxa
            </Label>
            <div className="flex h-fit w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-1">
              <Label htmlFor="fee" className="text-muted-foreground">
                Tipo
              </Label>

              <FeeTypeSelect id="fee" />

              <Label htmlFor="fee" className="text-muted-foreground">
                <ChevronDown size={16} />
              </Label>

              <Separator orientation="vertical" className="h-5" />

              <Label htmlFor="benchmark" className="text-muted-foreground">
                Índice
              </Label>

              <FeeIndexSelect id="benchmark" />

              <Label htmlFor="benchmark" className="text-muted-foreground">
                <ChevronDown size={16} />
              </Label>
            </div>
          </div>

          <div>
            <Label
              htmlFor="period"
              className="ml-1 text-sm font-medium leading-none"
            >
              Prazo
            </Label>

            <IntervalSelect id="period" className="h-[32.2px] w-fit px-2">
              <ChevronDown size={16} className="opacity-50" />
            </IntervalSelect>
          </div>

          <div>
            <Label className="ml-1 text-sm font-medium leading-none">
              Impostos
            </Label>
            <div className="flex h-fit w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
              <Checkbox id="tax" defaultChecked />
              <Label htmlFor="tax" className="text-muted-foreground">
                Imposto de renda
              </Label>
            </div>
          </div>

          <div>
            <Label className="ml-1 text-sm font-medium leading-none">
              Cupom
            </Label>
            <div className="flex h-fit w-fit items-center gap-2 rounded-md border border-input bg-background px-3 py-1">
              <Checkbox id="cupom" />
              <Label htmlFor="cupom" className="text-muted-foreground">
                Cupom de juros
              </Label>

              <Separator orientation="vertical" className="h-5" />

              <Label htmlFor="interval" className="text-muted-foreground">
                Intervalo
              </Label>

              <IntervalSelect id="interval" />

              <Label htmlFor="interval" className="text-muted-foreground">
                <ChevronDown size={16} />
              </Label>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
