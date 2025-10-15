"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, Upload } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import userService from "../services/user.service"
import type { Employee, Filter } from "../types"

const Users = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filter>({
    search: "",
    departement: "",
    statut: "",
  })

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await userService.getEmployees(1, 20, filters)
      setEmployees(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await userService.deleteEmployee(id)
        fetchEmployees()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <span className="badge-success">Actif</span>
      case "inactif":
        return <span className="badge-danger">Inactif</span>
      case "suspendu":
        return <span className="badge-warning">Suspendu</span>
      default:
        return <span className="badge">{statut}</span>
    }
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des utilisateurs</h1>
          <p className="text-accent">Gérez les employés et leurs informations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importer</span>
          </button>

          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel employé</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, matricule..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="input"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des employés */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Employé</th>
              <th className="table-header-cell">Matricule</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Département</th>
              <th className="table-header-cell">Rôle</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell text-center py-8">
                  <p className="text-accent">Aucun employé trouvé</p>
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {employee.photo ? (
                        <img
                          src={employee.photo || "/placeholder.svg"}
                          alt={`${employee.prenom} ${employee.nom}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {employee.prenom[0]}
                            {employee.nom[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-secondary">
                          {employee.prenom} {employee.nom}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{employee.matricule}</td>
                  <td className="table-cell">{employee.email}</td>
                  <td className="table-cell">{employee.departement}</td>
                  <td className="table-cell capitalize">{employee.role}</td>
                  <td className="table-cell">{getStatusBadge(employee.statut)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
