"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserX, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Présents aujourd'hui",
    value: "847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-chart-3",
  },
  {
    title: "Absents aujourd'hui",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: UserX,
    color: "text-chart-5",
  },
  {
    title: "Retards",
    value: "15",
    change: "+3%",
    trend: "up",
    icon: Clock,
    color: "text-chart-2",
  },
  {
    title: "Taux de présence",
    value: "97.4%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-chart-1",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={cn("text-xs mt-1", stat.trend === "up" ? "text-chart-3" : "text-chart-5")}>
              {stat.change} par rapport à hier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
