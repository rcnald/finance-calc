'use client'

import axios from 'axios'
import { useState } from 'react'
import { z } from 'zod'

import type { GetPeriodBody, GetPeriodResponse } from '@/app/api/period/route'
import { useCalcForm } from '@/hooks/useCalcForm'
import { useConfigParams } from '@/hooks/useConfigParams'
import {
  ConfigSchema,
  FieldSchema,
  getPeriod,
  handleCurrencyInputChange,
} from '@/lib/utils'

import { Box } from '../box'
import { Button } from '../button'
import { Input, InputUnit } from '../input'
import { Label } from '../label'
import { FeeInfoCard } from './fee-info-card'

const CalcPeriodSchema = ConfigSchema.extend({
  future_value: FieldSchema,
  present_value: FieldSchema,
  fee: FieldSchema.transform((value) => value / 100),
  contribution: z
    .string()
    .transform((value) => Number(value.replace(/\./g, '').replace(/,/g, '.')))
    .optional(),
})

export type CalcPeriodSchema = z.infer<typeof CalcPeriodSchema>

export function PeriodForm() {
  const [periodData, setPeriodData] = useState<GetPeriodResponse>()
  const { calcForm, fieldsState, CalcFormProvider } =
    useCalcForm<CalcPeriodSchema>(CalcPeriodSchema)

  const { periodInterval, feeType, cupom } = useConfigParams()

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = calcForm

  const feePeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()[0]
  const contributionPeriodUnit = getPeriod(periodInterval).toLocaleLowerCase()

  const handleCalcPeriod = async (periodFormData: CalcPeriodSchema) => {
    const payload: GetPeriodBody = {
      present_value: periodFormData.present_value,
      future_value: periodFormData.future_value,
      fee: periodFormData.fee,
      contribution: periodFormData.contribution,
      period_interval: periodFormData.period_interval,
      fee_type: periodFormData.fee_type,
    }

    if (periodFormData.fee_type !== 'pre') {
      payload.benchmark = periodFormData.benchmark
    }
    if (periodFormData.tax) payload.tax = periodFormData.tax
    if (periodFormData.cupom) payload.cupom = periodFormData.cupom_interval

    const { data } = await axios.post<GetPeriodResponse>('/api/period', payload)

    setPeriodData(data)
  }

  return (
    <CalcFormProvider
      onSubmit={handleSubmit(handleCalcPeriod)}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="future-value">Quanto você precisa?</Label>
        <Input
          id="future-value"
          placeholder="0"
          inputMode="numeric"
          aria-invalid={fieldsState.future_value.error}
          {...register('future_value')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit corner="left">R$</InputUnit>
        </Input>
        <Label
          htmlFor="future-value"
          className="text-xs font-bold text-destructive"
          aria-hidden={!fieldsState.future_value.error}
        >
          {fieldsState.future_value.message}
        </Label>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="present-value">Quanto você tem hoje?</Label>
        <Input
          id="present-value"
          placeholder="0,00"
          inputMode="numeric"
          aria-invalid={fieldsState.present_value.error}
          {...register('present_value')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit corner="left">R$</InputUnit>
        </Input>
        <Label
          htmlFor="present-value"
          className="text-xs font-bold text-destructive"
          aria-hidden={!fieldsState.present_value.error}
        >
          {fieldsState.present_value.message}
        </Label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="fee">Qual a taxa do seu investimento?</Label>
          {feeType !== 'pre' ? <FeeInfoCard /> : null}
        </div>
        <Input
          id="fee"
          placeholder="0,00"
          inputMode="numeric"
          aria-invalid={fieldsState.fee.error}
          {...register('fee')}
          onChange={handleCurrencyInputChange}
        >
          <InputUnit className="px-3">% a.{feePeriodUnit}</InputUnit>
        </Input>
        <Label
          htmlFor="fee"
          className="text-xs font-bold text-destructive"
          aria-hidden={!fieldsState.fee.error}
        >
          {fieldsState.fee.message}
        </Label>
      </div>

      {!cupom ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="contribution">
            Quanto você vai investir regularmente?
          </Label>
          <Input
            id="contribution"
            placeholder="0,00"
            inputMode="numeric"
            aria-invalid={fieldsState.contribution.error}
            {...register('contribution')}
            onChange={handleCurrencyInputChange}
          >
            <InputUnit corner="left">R$</InputUnit>
            <InputUnit corner="right">Por {contributionPeriodUnit}</InputUnit>
          </Input>
          <Label
            htmlFor="contribution"
            className="text-xs font-bold text-destructive"
            aria-hidden={!fieldsState.contribution.error}
          >
            {fieldsState.contribution.message}
          </Label>
        </div>
      ) : null}

      <Button className="w-full">Calcular</Button>

      <Box className="flex flex-col items-center justify-center">
        <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
          Você precisará de
        </h2>
        <strong className="font-mono text-5xl text-slate-700">
          <pre>
            {isSubmitting ? 'carregando' : JSON.stringify(periodData, null, 2)}
          </pre>
        </strong>
        <span className="text-muted-foreground">Meses</span>
      </Box>
    </CalcFormProvider>
  )
}
