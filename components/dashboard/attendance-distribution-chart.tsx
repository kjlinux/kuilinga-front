"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
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

type DistributionData = {
  name: string
  value: number
  fill: string
}

const chartConfig = {
  presents: { label: "Présents", color: "oklch(var(--chart-1))" },
  absents: { label: "Absents", color: "oklch(var(--chart-5))" },
  retards: { label: "Retards", color: "oklch(var(--chart-2))" },
}

export function AttendanceDistributionChart() {
  const [data, setData] = useState<DistributionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDistributionData = async () => {
      setLoading(true)
      const result = await api.getAttendanceDistribution()
      const formattedData = result.map((item) => ({
        ...item,
        fill: chartConfig[item.name as keyof typeof chartConfig].color,
      }))
      setData(formattedData)
      setLoading(false)
    }
    fetchDistributionData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition journalière</CardTitle>
        <CardDescription>Distribution des statuts de présence</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
