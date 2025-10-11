"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", presents: 18500, absents: 450, retards: 320 },
  { month: "Fév", presents: 17800, absents: 520, retards: 380 },
  { month: "Mar", presents: 19200, absents: 380, retards: 290 },
  { month: "Avr", presents: 18900, absents: 420, retards: 310 },
  { month: "Mai", presents: 19500, absents: 350, retards: 280 },
  { month: "Juin", presents: 19100, absents: 410, retards: 300 },
]

export function MonthlyAttendanceChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Évolution mensuelle</CardTitle>
        <CardDescription>Statistiques des 6 derniers mois</CardDescription>
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
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="presents" fill="var(--color-presents)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absents" fill="var(--color-absents)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retards" fill="var(--color-retards)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
