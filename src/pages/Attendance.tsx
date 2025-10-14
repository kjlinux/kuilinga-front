"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, RefreshCw } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import attendanceService from "../services/attendance.service"
import departmentService from "../services/department.service"
import type { Attendance as AttendanceType, Filter as FilterType, Department } from "../types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const Attendance = () => {
  const [attendances, setAttendances] = useState<AttendanceType[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    departement: "",
    statut: "",
    classe: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchAttendances()
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(fetchAttendances, 30000)
    return () => clearInterval(interval)
  }, [filters, fetchAttendances])

  const fetchInitialData = async () => {
    try {
      const deptResponse = await departmentService.getDepartments()
      setDepartments(deptResponse.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error)
    }
  }

  const fetchAttendances = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const data = await attendanceService.getRealtime(filters)
      setAttendances(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des présences:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [filters])

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "present":
        return <span className="badge-success">Présent</span>
      case "absent":
        return <span className="badge-danger">Absent</span>
      case "retard":
        return <span className="badge-warning">En retard</span>
      case "sortie_anticipee":
        return <span className="badge-info">Sortie anticipée</span>
      default:
        return <span className="badge">{statut}</span>
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Présences en temps réel</h1>
          <p className="text-accent">Dernière mise à jour: {format(new Date(), "HH:mm:ss", { locale: fr })}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchAttendances} disabled={isRefreshing} className="btn-outline flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
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
                placeholder="Rechercher par nom, matricule..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Bouton filtres */}
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Département</label>
              <select
                value={filters.departement}
                onChange={(e) => setFilters({ ...filters, departement: e.target.value })}
                className="input"
              >
                <option value="">Tous les départements</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Classe / Niveau</label>
              <input
                type="text"
                placeholder="Ex: 6ème, L1..."
                value={filters.classe}
                onChange={(e) => setFilters({ ...filters, classe: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="input"
              >
                <option value="">Tous les statuts</option>
                <option value="present">Présent</option>
                <option value="absent">Absent</option>
                <option value="retard">En retard</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: "", departement: "", statut: "" })}
                className="btn-outline w-full"
              >
                Réinitialiser
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Tableau des présences */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Nom</th>
              <th className="table-header-cell">Matricule</th>
              <th className="table-header-cell">Département</th>
              <th className="table-header-cell">Arrivée</th>
              <th className="table-header-cell">Départ</th>
              <th className="table-header-cell">Durée</th>
              <th className="table-header-cell">Statut</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell text-center py-8">
                  <p className="text-accent">Aucune donnée de présence disponible</p>
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
                  <td className="table-cell font-medium">{attendance.employee_name}</td>
                  <td className="table-cell">{attendance.matricule}</td>
                  <td className="table-cell">{attendance.departement}</td>
                  <td className="table-cell">
                    {attendance.heure_arrivee
                      ? format(new Date(attendance.heure_arrivee), "HH:mm", { locale: fr })
                      : "-"}
                  </td>
                  <td className="table-cell">
                    {attendance.heure_depart ? format(new Date(attendance.heure_depart), "HH:mm", { locale: fr }) : "-"}
                  </td>
                  <td className="table-cell">{formatDuration(attendance.duree)}</td>
                  <td className="table-cell">{getStatusBadge(attendance.statut)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {attendances.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-accent">Affichage de {attendances.length} résultat(s)</p>

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
  )
}

export default Attendance
