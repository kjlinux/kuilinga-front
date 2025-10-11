"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { api } from "@/lib/api/index"

type DistributionData = {
  name: string
  value: number
  color: string
}

export function AttendanceDistributionChart() {
  const [data, setData] = useState<DistributionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDistributionData = async () => {
      setLoading(true)
      const result = await api.getAttendanceDistribution()
      setData(result)
      setLoading(false)
    }
    fetchDistributionData()
  }, [])

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Répartition aujourd&apos;hui</CardTitle>
        <CardDescription>Distribution des statuts de présence</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
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
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
