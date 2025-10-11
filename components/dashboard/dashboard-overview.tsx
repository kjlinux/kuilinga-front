"use client"

import { StatsCards } from "./stats-cards"
import { AttendanceTrendChart } from "./attendance-trend-chart"
import { AttendanceDistributionChart } from "./attendance-distribution-chart"
import { RecentActivity } from "./recent-activity"
import { QuickActions } from "./quick-actions"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Vue d&apos;ensemble des présences et statistiques en temps réel</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceTrendChart />
        <AttendanceDistributionChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
