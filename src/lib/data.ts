export const CALC_MODE = {
  period: 'Prazo',
  fee: 'Taxa',
  'present-value': 'V. Presente',
  'future-value': 'V. Futuro',
  contributions: 'Aportes',
} as const

export type CalcMode = keyof typeof CALC_MODE

export const CalcModeSchema = Object.keys(CALC_MODE) as [CalcMode]

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

export const monthInDays = 30
export const twoMonthsInDays = 60
export const quarterInDays = 90
export const halfYearInDays = 182.5
export const yearInDays = 365

export const IR = {
  bellow180days: 0.225,
  between181and360days: 0.2,
  between361and720days: 0.175,
  above721days: 0.15,
} as const

export const BENCHMARKS = {
  cdi: 0.104,
  selic: 0.105,
  ipca: 0.0405,
} as const
