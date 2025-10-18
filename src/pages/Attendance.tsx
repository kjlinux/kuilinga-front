"use client"

import { useEffect } from "react"
import { Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import attendanceService from "../services/attendance.service"
import type { Attendance as AttendanceType } from "../types"

const Attendance = () => {
  const {
    data,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<AttendanceType>({
    fetchData: attendanceService.getAttendances,
  })

  useEffect(() => {
    const interval = setInterval(refresh, 30000) // Auto-refresh every 30 seconds
    return () => clearInterval(interval)
  }, [refresh])

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
    { key: "duration", header: "Durée" },
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
            Dernière mise à jour:{" "}
            {format(new Date(), "HH:mm:ss", { locale: fr })}
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
          duration: a.duration ?? "N/A",
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