"use client"

import { useState, useEffect } from "react"
import useWebSocket from "react-use-websocket"
import { toast } from "sonner"
import { Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import useNotification from "../hooks/useNotification"
import attendanceService from "../services/attendance.service"
import authService from "../services/auth.service"
import type { Attendance as AttendanceType } from "../types"

const WEBSOCKET_URL = "ws://localhost:8000/api/v1/ws/attendance/realtime"

const Attendance = () => {
  const [socketUrl, setSocketUrl] = useState<string | null>(null)
  const [lastProcessedId, setLastProcessedId] = useState<string | null>(null)

  const {
    data,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
    setData,
  } = useDataTable<AttendanceType>({
    fetchData: attendanceService.getAttendances,
  })

  useEffect(() => {
    const token = authService.getAccessToken()
    if (token) {
      setSocketUrl(`${WEBSOCKET_URL}?token=${token}`)
    }
  }, [])

  const { playNotificationSound } = useNotification()

  const { lastMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    retryOnError: true,
  })

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data)
      if (messageData.type === "new_attendance") {
        const newAttendance = messageData.payload
        if (newAttendance.id !== lastProcessedId) {
          setData((prevData) => {
            if (!prevData?.some((att) => att.id === newAttendance.id)) {
              return [newAttendance, ...(prevData || [])]
            }
            return prevData
          })
          toast.success("Nouveau pointage reçu!")
          playNotificationSound()
          setLastProcessedId(newAttendance.id)
        }
      }
    }
  }, [lastMessage, setData, playNotificationSound, lastProcessedId])

  const columns = [
    {
      key: "employee",
      header: "Employé",
    },
    {
      key: "timestamp",
      header: "Date/Heure",
    },
    { key: "type", header: "Type" },
    // { key: "duration", header: "Durée" },
    { key: "device", header: "Dispositif" },
    { key: "geo", header: "Géolocalisation" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Présences en temps réel
          </h1>
          <p className="text-accent">
            Connecté au serveur temps réel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="btn-outline flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      <DataTable
        data={(data || []).map((a) => ({
          ...a,
          employee: a.employee
            ? `${a.employee.first_name} ${a.employee.last_name}`
            : "N/A",
          timestamp: format(new Date(a.timestamp), "Pp", { locale: fr }),
          // duration: a.duration ?? "N/A",
          device: a.device?.serial_number ?? "N/A",
          geo: a.geo ?? "N/A",
        }))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={() => {}} // No edit action
        onDelete={() => {}} // No delete action
        error={error}
      />
    </div>
  )
}

export default Attendance