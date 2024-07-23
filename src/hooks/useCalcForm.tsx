import { zodResolver } from '@hookform/resolvers/zod'
import React, { ComponentProps, useState } from 'react'
import { DefaultValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CalcConfig } from '@/components/ui/calc-config'
import { type ConfigSchemaType } from '@/lib/utils'

import { useConfigParams } from './useConfigParams'

export type FieldsValidity<T extends string | number | symbol> = Record<
  T,
  { error?: boolean; message?: string }
>

type CalcSchemaType = {
  [K in string]: number | string | boolean
}

export function useCalcForm<T extends ConfigSchemaType & CalcSchemaType>(
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>,
  defaultValues?: DefaultValues<T>,
) {
  const { periodInterval, benchmark, feeType, tax, cupom, cupomInterval } =
    useConfigParams()

  const [open, setOpen] = useState(false)

  const calcForm = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: {
      benchmark,
      cupom,
      cupom_interval: cupomInterval,
      fee_type: feeType,
      period_interval: periodInterval,
      tax,
      ...defaultValues,
    } as DefaultValues<T>,
  })

  const fieldsKeys = Object.keys(schema.shape) as [keyof T]

  const fieldsState = fieldsKeys.reduce(
    (acc, field) => {
      return {
        ...acc,
        [field]: {
          error: Boolean(calcForm.formState.errors[field]?.message),
          message: calcForm.formState.errors[field]?.message,
        },
      }
    },
    {} as FieldsValidity<keyof T>,
  )

  interface CalcFormProviderProps extends ComponentProps<'form'> {}

  const CalcFormProvider = ({ children, ...props }: CalcFormProviderProps) => {
    return (
      <FormProvider {...calcForm}>
        <form {...props}>
          <CalcConfig open={open} onOpenChange={setOpen} />
          {children}
        </form>
      </FormProvider>
    )
  }

  return { calcForm, fieldsState, CalcFormProvider }
}
