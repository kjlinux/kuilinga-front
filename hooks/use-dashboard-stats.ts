"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import type { DashboardStats, TrendData } from "@/lib/types"
import { mockDashboardStats, mockTrendData } from "@/lib/mock-data"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    fetchTrendData("week")
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    // En mode développement, utiliser les données mockées
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        setStats(mockDashboardStats)
        setLoading(false)
      }, 500)
      return
    }

    const response = await apiService.getDashboardStats()

    if (response.error) {
      setError(response.error)
      setStats(null)
    } else {
      setStats(response.data || null)
    }

    setLoading(false)
  }

  const fetchTrendData = async (period: string) => {
    // En mode développement, utiliser les données mockées
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        setTrendData(mockTrendData)
      }, 500)
      return
    }

    const response = await apiService.getTrendData(period)

    if (response.error) {
      setError(response.error)
      setTrendData([])
    } else {
      setTrendData(response.data || [])
    }
  }

  return {
    stats,
    trendData,
    loading,
    error,
    fetchStats,
    fetchTrendData,
  }
}
