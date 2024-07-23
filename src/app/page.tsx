'use client'

import { ContributionForm } from '@/components/ui/calc-form/contribution-form'
import { FeeForm } from '@/components/ui/calc-form/fee-form'
import { FutureValueForm } from '@/components/ui/calc-form/future-value-form'
import { PeriodForm } from '@/components/ui/calc-form/period-form'
import { PresentValueForm } from '@/components/ui/calc-form/present-value-form'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryParams } from '@/hooks/useQueryParams'
import { CALC_MODE, CalcMode, CalcModeSchema } from '@/lib/data'

export default function Page() {
  const [currentTab, setCurrentTab] = useQueryParams<CalcMode>(
    'calc-mode',
    'period',
    CalcModeSchema,
  )

  return (
    <>
      <main>
        <Card className="flex p-4">
          <section className="flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>O que vamos calcular hoje?</CardTitle>
              <CardDescription>
                Selecione o tipo de calculo que iremos fazer
              </CardDescription>
            </CardHeader>
            <Tabs
              defaultValue={currentTab}
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value as CalcMode)}
              className="flex w-[400px] flex-col items-center"
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
              <TabsContent value="contributions">
                <ContributionForm />
              </TabsContent>
            </Tabs>
          </section>
          <section className="flex flex-col items-center justify-center"></section>
        </Card>
      </main>
    </>
  )
}
