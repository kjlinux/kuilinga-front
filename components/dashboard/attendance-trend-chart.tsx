"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { date: "Lun", presents: 820, absents: 30, retards: 20 },
  { date: "Mar", presents: 835, absents: 25, retards: 15 },
  { date: "Mer", presents: 845, absents: 20, retards: 18 },
  { date: "Jeu", presents: 830, absents: 28, retards: 22 },
  { date: "Ven", presents: 847, absents: 23, retards: 15 },
  { date: "Sam", presents: 420, absents: 5, retards: 8 },
  { date: "Dim", presents: 0, absents: 0, retards: 0 },
]

export function AttendanceTrendChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Évolution des présences</CardTitle>
        <CardDescription>Tendance hebdomadaire des présences</CardDescription>
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
      </CardContent>
    </Card>
  )
}
