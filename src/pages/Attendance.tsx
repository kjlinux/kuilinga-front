"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import attendanceService from "../services/attendance.service";
import type {
  Attendance as AttendanceType,
  PaginationParams,
} from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Attendance = () => {
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchAttendances = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await attendanceService.getAttendances(pagination);
      if (data) {
        setAttendances(data.items);
      } else {
        setAttendances([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des présences:", error);
      setAttendances([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchAttendances();
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(fetchAttendances, 30000);
    return () => clearInterval(interval);
  }, [pagination, fetchAttendances]);

  const handleSearch = (value: string) => {
    setPagination({ ...pagination, search: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

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
            {format(new Date(), "HH:mm:ss", { locale: fr })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAttendances}
            disabled={isRefreshing}
            className="btn-outline flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
              <input
                type="text"
                placeholder="Rechercher par ID employé..."
                value={pagination.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Tableau des présences */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Employé</th>
              <th className="table-header-cell">Département</th>
              <th className="table-header-cell">Site</th>
              <th className="table-header-cell">Date/Heure</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Dispositif</th>
              <th className="table-header-cell">Géolocalisation</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell text-center py-8">
                  <p className="text-accent">
                    Aucune donnée de présence disponible
                  </p>
                </td>
              </tr>
            ) : (
              attendances.map((attendance) => (
                <motion.tr
                  key={attendance.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell font-medium">
                    {attendance.employee ? `${attendance.employee.first_name} ${attendance.employee.last_name}` : "N/A"}
                  </td>
                  <td className="table-cell">{attendance.employee?.department?.name || "N/A"}</td>
                  <td className="table-cell">{attendance.employee?.department?.site?.name || "N/A"}</td>
                  <td className="table-cell">
                    {format(new Date(attendance.timestamp), "Pp", {
                      locale: fr,
                    })}
                  </td>
                  <td className="table-cell">{attendance.type}</td>
                  <td className="table-cell">{attendance.device?.serial_number || "N/A"}</td>
                  <td className="table-cell">{attendance.geo || "N/A"}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {attendances.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-accent">
            Affichage de {attendances.length} résultat(s)
          </p>

          <div className="flex items-center gap-2">
            <button className="btn-outline px-3 py-1 text-sm">Précédent</button>
            <button className="btn-primary px-3 py-1 text-sm">1</button>
            <button className="btn-outline px-3 py-1 text-sm">2</button>
            <button className="btn-outline px-3 py-1 text-sm">3</button>
            <button className="btn-outline px-3 py-1 text-sm">Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;