import { Label as L, Pie, PieChart } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCompact, getChartData } from '@/lib/utils'

export interface IncomeChartProps {
  discountedIncome?: number
  income?: number
  investedAmount?: number
}

export function useIncomeChart({
  discountedIncome,
  income,
  investedAmount,
}: IncomeChartProps) {
  const { chartConfig, chartData } = getChartData({
    discountedIncome,
    income,
    investedAmount,
  })

  const finalAmount = formatCompact.format(
    chartData.reduce((accumulatorAmount, currentAmount) => {
      if (currentAmount.name !== 'tax') {
        return (accumulatorAmount += currentAmount.amount ?? 0)
      }
      return accumulatorAmount
    }, 0),
  )

  const IncomeChart = () => {
    return (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] min-w-[400px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
            <L
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {finalAmount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Reais
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center [&>*]:whitespace-nowrap"
          />
        </PieChart>
      </ChartContainer>
    )
  }

  return { IncomeChart }
}
