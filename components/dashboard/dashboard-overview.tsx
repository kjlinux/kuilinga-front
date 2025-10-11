"use client"

import { StatsCards } from "./stats-cards"
import { AttendanceTrendChart } from "./attendance-trend-chart"
import { AttendanceDistributionChart } from "./attendance-distribution-chart"
import { RecentActivity } from "./recent-activity"
import { QuickActions } from "./quick-actions"

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d&apos;ensemble des présences et statistiques en temps réel.
          </p>
        </div>
        <QuickActions />
      </header>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AttendanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <AttendanceDistributionChart />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
