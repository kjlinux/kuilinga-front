"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import type { AttendanceRecord } from "@/lib/types"
import { mockAttendanceRecords } from "@/lib/mock-data"

export function useAttendance() {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAttendances()
  }, [])

  const fetchAttendances = async (filters?: Record<string, string>) => {
    setLoading(true)
    setError(null)

    // En mode développement, utiliser les données mockées
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        setAttendances(mockAttendanceRecords)
        setLoading(false)
      }, 500)
      return
    }

    const response = await apiService.getAttendances(filters)

    if (response.error) {
      setError(response.error)
      setAttendances([])
    } else {
      setAttendances(response.data || [])
    }

    setLoading(false)
  }

  const createAttendance = async (data: {
    employeeId: string
    type: "in" | "out"
  }) => {
    const response = await apiService.createAttendance(data)

    if (response.error) {
      setError(response.error)
      return false
    }

    // Rafraîchir la liste
    await fetchAttendances()
    return true
  }

  return {
    attendances,
    loading,
    error,
    fetchAttendances,
    createAttendance,
  }
}
