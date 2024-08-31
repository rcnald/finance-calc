import { formatOutputValues, OutputResponse } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

export function ReportTable<T extends OutputResponse | undefined>({
  reportData,
}: {
  reportData: T
}) {
  const {
    annualFee,
    annualRealFee,
    discountedIncome,
    futureValue,
    futureValueGross,
    income,
    investedAmount,
    periodInBusinessDays,
    periodInDays,
    presentValue,
    realIncome,
    tax,
    taxAmount,
  } = formatOutputValues<T>({
    data: reportData,
  })

  return (
    <Table className="flex border">
      <TableHeader className="border-r [&_th]:border-b [&_th]:font-bold [&_tr]:border-b-0">
        <TableRow className="flex flex-col">
          <TableHead className="flex h-auto w-[150px] items-center whitespace-nowrap p-4">
            Valor presente
          </TableHead>
          <TableHead className="flex h-[80px] w-[150px] items-center p-4">
            Valor futuro bruto
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Valor futuro
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Taxa anual
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Taxa anual real
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Período em dias
          </TableHead>
          <TableHead className="flex h-[80px] w-[150px] items-center p-4">
            Período em dias uteis
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Valor investido
          </TableHead>
          <TableHead className="flex h-[80px] w-[150px] items-center p-4">
            Rendimento Bruto
          </TableHead>
          <TableHead className="flex h-[80px] w-[150px] items-center p-4">
            Valor imposto de renda
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Alíquota
          </TableHead>
          <TableHead className="flex h-[80px] w-[150px] items-center p-4">
            Rendimento liquido de IR
          </TableHead>
          <TableHead className="flex h-auto w-[150px] items-center p-4">
            Rendimento real
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        <TableRow className="flex flex-col [&_td]:border-b [&_td]:text-end">
          <TableCell>{presentValue}</TableCell>
          <TableCell className="h-[80px]">{futureValueGross}</TableCell>
          <TableCell>{futureValue}</TableCell>
          <TableCell>{annualFee}%</TableCell>
          <TableCell>{annualRealFee}%</TableCell>
          <TableCell>{periodInDays}</TableCell>
          <TableCell className="h-[80px]">{periodInBusinessDays}</TableCell>
          <TableCell>{investedAmount}</TableCell>
          <TableCell className="h-[80px]">{income}</TableCell>
          <TableCell className="h-[80px]">{taxAmount}</TableCell>
          <TableCell>{tax}%</TableCell>
          <TableCell className="h-[80px]">{discountedIncome}</TableCell>
          <TableCell>{realIncome}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
