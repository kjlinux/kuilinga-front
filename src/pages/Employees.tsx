"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, Upload } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import employeeService from "../services/employee.service"
import type { Employee, PaginationParams } from "../types"

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await employeeService.getEmployees(pagination)
      setEmployees(response.items)
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await employeeService.deleteEmployee(id)
        fetchEmployees()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des employés</h1>
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
                value={pagination.search}
                onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
                className="input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des employés */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">N° Employé</th>
              <th className="table-header-cell">Nom complet</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Téléphone</th>
              <th className="table-header-cell">Poste</th>
              <th className="table-header-cell">Département</th>
              <th className="table-header-cell">Site</th>
              <th className="table-header-cell">Badge ID</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={10} className="table-cell text-center py-8">
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
                  <td className="table-cell">{employee.employee_id || "N/A"}</td>
                  <td className="table-cell">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="table-cell">{employee.email}</td>
                  <td className="table-cell">{employee.phone_number || "N/A"}</td>
                  <td className="table-cell">{employee.position || "N/A"}</td>
                  <td className="table-cell">{employee.department?.name || "N/A"}</td>
                  <td className="table-cell">{employee.department?.site?.name || "N/A"}</td>
                  <td className="table-cell">{employee.badge_number || "N/A"}</td>
                  <td className="table-cell">
                    {employee.user?.is_active ? (
                      <span className="badge-success">Actif</span>
                    ) : (
                      <span className="badge-danger">Inactif</span>
                    )}
                  </td>
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

export default Employees