'use client'

// import { Box } from '@/components/ui/box'
import { CalcFeeForm } from '@/components/ui/calc-form/calc-fee-form'
import { CalcPeriodForm } from '@/components/ui/calc-form/calc-period-form'
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
              <CalcPeriodForm />
            </TabsContent>
            <TabsContent value="fee">
              <CalcFeeForm />
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
