"use client"

import { useEffect, useState } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "@/lib/api/index"

type TrendData = {
  date: string
  presents: number
  absents: number
  retards: number
}

const chartConfig = {
  presents: {
    label: "Présents",
    color: "hsl(var(--chart-2))",
  },
  absents: {
    label: "Absents",
    color: "hsl(var(--chart-5))",
  },
  retards: {
    label: "Retards",
    color: "hsl(var(--chart-4))",
  },
}

export function AttendanceTrendChart() {
  const [data, setData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true)
      const result = await api.getAttendanceTrend()
      setData(result)
      setLoading(false)
    }
    fetchTrendData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des présences</CardTitle>
        <CardDescription>Tendance sur les 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend content={<CustomLegend />} />
                <Line
                  dataKey="presents"
                  type="monotone"
                  stroke={chartConfig.presents.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="absents"
                  type="monotone"
                  stroke={chartConfig.absents.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="retards"
                  type="monotone"
                  stroke={chartConfig.retards.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center space-x-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">
            {chartConfig[entry.dataKey as keyof typeof chartConfig]?.label}
          </span>
        </div>
      ))}
    </div>
  )
}
