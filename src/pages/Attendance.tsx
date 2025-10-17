"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import DataTable from "../components/DataTable";
import useDataTable from "../hooks/useDataTable";
import attendanceService from "../services/attendance.service";
import type { Attendance as AttendanceType } from "../types";

const Attendance = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<AttendanceType>({
    fetchData: attendanceService.getAttendances,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
      setLastUpdated(new Date());
    }, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, [refresh]);

  const handleRefresh = () => {
    refresh();
    setLastUpdated(new Date());
  };

  const columns = [
    {
      key: "employee",
      header: "Employé",
      render: (item: AttendanceType) =>
        item.employee
          ? `${item.employee.first_name} ${item.employee.last_name}`
          : "N/A",
    },
    {
      key: "timestamp",
      header: "Date/Heure",
      render: (item: AttendanceType) =>
        format(new Date(item.timestamp), "Pp", { locale: fr }),
    },
    { key: "type", header: "Type" },
    {
      key: "duration",
      header: "Durée",
      render: (item: AttendanceType) => item.duration ?? "N/A",
    },
    {
      key: "device",
      header: "Dispositif",
      render: (item: AttendanceType) => item.device?.serial_number ?? "N/A",
    },
    {
      key: "geo",
      header: "Géolocalisation",
      render: (item: AttendanceType) => item.geo ?? "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Présences en temps réel
          </h1>
          <p className="text-accent">
            Dernière mise à jour:{" "}
            {format(lastUpdated, "HH:mm:ss", { locale: fr })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
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
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Rechercher par ID employé..."
      />
    </div>
  );
};

export default Attendance;