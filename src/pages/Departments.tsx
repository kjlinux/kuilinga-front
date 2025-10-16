"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import departmentService from "../services/department.service"
import type { Department, PaginationParams } from "../types"

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await departmentService.getDepartments(pagination)
      setDepartments(response.items)
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])


  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      try {
        await departmentService.deleteDepartment(id)
        fetchDepartments()
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des départements</h1>
          <p className="text-accent">Gérez les départements de vos sites</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau département</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={pagination.search}
            onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Tableau des départements */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Nom</th>
              <th className="table-header-cell">Site</th>
              <th className="table-header-cell">Manager</th>
              <th className="table-header-cell">N° Employés</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-cell text-center py-8">
                  <p className="text-accent">Aucun département trouvé</p>
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <motion.tr
                  key={dept.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">{dept.name}</td>
                  <td className="table-cell">{dept.site?.name ?? "N/A"}</td>
                  <td className="table-cell">{dept.manager?.full_name ?? "N/A"}</td>
                  <td className="table-cell">{dept.employees_count}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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

export default Departments