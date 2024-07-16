export const FEE_INDEX = {
  cdi: 'CDI',
  ipca: 'IPCA',
  selic: 'SELIC',
} as const

export type FeeIndex = keyof typeof FEE_INDEX

export const FeeIndexSchema = Object.keys(FEE_INDEX) as [FeeIndex]

export const FEE_TYPES = {
  pre: 'Pré-fixado',
  pos: 'Pós-fixado',
  indexed: 'Indexado',
} as const

export type FeeType = keyof typeof FEE_TYPES

export const FeeTypeSchema = Object.keys(FEE_TYPES) as [FeeType]

export const INTERVAL = {
  month: 'Mês',
  year: 'Ano',
  'half-year': 'Semestre',
  'two-months': 'Bimestre',
  quarter: 'Trimestre',
} as const

export const PLURAL_INTERVAL = {
  month: 'Meses',
  year: 'Anos',
  'half-year': 'Semestres',
  'two-months': 'Bimestres',
  quarter: 'Trimestres',
} as const

export type Interval = keyof typeof INTERVAL

export const IntervalSchema = Object.keys(INTERVAL) as [Interval]
