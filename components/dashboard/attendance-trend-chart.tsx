"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { api } from "@/lib/api/index"

type TrendData = {
  date: string
  presents: number
  absents: number
  retards: number
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
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Évolution des présences</CardTitle>
        <CardDescription>Tendance hebdomadaire des présences</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer
            config={{
              presents: {
                label: "Présents",
                color: "hsl(var(--chart-1))",
              },
              absents: {
                label: "Absents",
                color: "hsl(var(--chart-5))",
              },
              retards: {
                label: "Retards",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="presents"
                  stroke="var(--color-presents)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-presents)", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="absents"
                  stroke="var(--color-absents)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-absents)", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="retards"
                  stroke="var(--color-retards)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-retards)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
