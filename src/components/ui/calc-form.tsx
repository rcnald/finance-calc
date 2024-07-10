import { Info } from 'lucide-react'

import { Button } from './button'
import { Input, InputUnit } from './input'
import { Label } from './label'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export interface CalcFormProps {}

export function CalcForm({ ...props }: CalcFormProps) {
  return (
    <div {...props}>
      <Label>Daqui quanto tempo você precisa?</Label>
      <Input className="font-semibold">
        <InputUnit>Meses</InputUnit>
      </Input>
      <div className="flex items-center gap-2">
        <Label>Quanto você tem hoje?</Label>
      </div>
      <Input className="pl-12 font-semibold">
        <InputUnit corner="left">R$</InputUnit>
      </Input>
      <div className="flex items-center gap-2">
        <Label>Qual a taxa do seu investimento?</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="h-fit p-4">
              <Info size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Índice de referencia -{' '}
              <span className="font-mono font-medium">CDI</span>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Input className="font-semibold">
        <InputUnit className="px-3">%</InputUnit>
      </Input>
      <div className="flex items-center gap-2">
        <Label>Quanto você vai investir regularmente?</Label>
      </div>
      <Input className="pl-12 font-semibold">
        <InputUnit corner="left">R$</InputUnit>
        <InputUnit corner="right">Por mês</InputUnit>
      </Input>
      <Button className="w-full">Calcular</Button>
    </div>
  )
}
