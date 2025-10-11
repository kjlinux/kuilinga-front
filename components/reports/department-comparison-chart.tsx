"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { department: "IT", taux: 98.5 },
  { department: "RH", taux: 97.2 },
  { department: "Finance", taux: 96.8 },
  { department: "Marketing", taux: 95.5 },
  { department: "Ventes", taux: 94.2 },
]

export function DepartmentComparisonChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Comparaison par département</CardTitle>
        <CardDescription>Taux de présence moyen par département</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            taux: {
              label: "Taux de présence (%)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[90, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="taux" fill="var(--color-taux)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
