import { CalcConfig } from '@/components/ui/calc-config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Page() {
  return (
    <>
      <main>
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-card-foreground">
            O que vamos calcular hoje?
          </h1>
          <Tabs defaultValue="period" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="period">Prazo</TabsTrigger>
              <TabsTrigger value="taxe">Taxa</TabsTrigger>
              <TabsTrigger value="present-value">Valor Presente</TabsTrigger>
              <TabsTrigger value="future-value">Valor Futuro</TabsTrigger>
              <TabsTrigger value="contributions">Aportes</TabsTrigger>
            </TabsList>
            <TabsContent value="period">
              <CalcConfig />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </>
  )
}
