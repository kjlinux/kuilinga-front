"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Présents", value: 847, color: "hsl(var(--chart-1))" },
  { name: "Absents", value: 23, color: "hsl(var(--chart-5))" },
  { name: "Retards", value: 15, color: "hsl(var(--chart-2))" },
]

export function AttendanceDistributionChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Répartition aujourd'hui</CardTitle>
        <CardDescription>Distribution des statuts de présence</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
