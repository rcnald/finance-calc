'use client'

import { ContributionForm } from '@/components/ui/calc-form/contribution-form'
// import { Box } from '@/components/ui/box'
import { FeeForm } from '@/components/ui/calc-form/fee-form'
import { FutureValueForm } from '@/components/ui/calc-form/future-value-form'
import { PeriodForm } from '@/components/ui/calc-form/period-form'
import { PresentValueForm } from '@/components/ui/calc-form/present-value-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryParams } from '@/hooks/useQueryParams'

const CALC_MODE = {
  period: 'Prazo',
  fee: 'Taxa',
  'present-value': 'Valor Presente',
  'future-value': 'Valor Futuro',
  contributions: 'Aportes',
} as const

export type CalcMode = keyof typeof CALC_MODE

export const CalcModeSchema = Object.keys(CALC_MODE) as [CalcMode]

export default function Page() {
  const [calcMode, setCalcMode] = useQueryParams<CalcMode>(
    'calc-mode',
    'period',
    CalcModeSchema,
  )

  const currentTab = calcMode

  return (
    <>
      <main>
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-card-foreground">
            O que vamos calcular hoje?
          </h1>
          <Tabs
            defaultValue={currentTab}
            value={currentTab}
            onValueChange={(value) => setCalcMode(value as CalcMode)}
            className="w-[400px]"
          >
            <TabsList>
              {Object.entries(CALC_MODE).map(([key, value]) => {
                return (
                  <TabsTrigger key={key} value={key as CalcMode}>
                    {value}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value="period">
              <PeriodForm />
            </TabsContent>
            <TabsContent value="fee">
              <FeeForm />
            </TabsContent>
            <TabsContent value="present-value">
              <PresentValueForm />
            </TabsContent>
            <TabsContent value="future-value">
              <FutureValueForm />
            </TabsContent>
            <TabsContent value="contribution">
              <ContributionForm />
            </TabsContent>
            {/* <Box className="flex flex-col items-center justify-center">
                <h2 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
                  Você precisará de
                </h2>
                <strong className="font-mono text-5xl text-slate-700">
                  24
                </strong>
                <span className="text-muted-foreground">Meses</span>
              </Box> */}
          </Tabs>
        </section>
      </main>
    </>
  )
}
