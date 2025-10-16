"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import organizationService from "../services/organization.service"
import type { Organization, PaginationParams } from "../types"

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await organizationService.getOrganizations(pagination)
      setOrganizations(response.items)
    } catch (error) {
      console.error("Erreur lors de la récupération des organisations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette organisation ?")) {
      try {
        await organizationService.deleteOrganization(id)
        fetchOrganizations()
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des organisations</h1>
          <p className="text-accent">Gérez les organisations et leurs informations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle organisation</span>
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

      {/* Tableau des organisations */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Nom</th>
              <th className="table-header-cell">Industrie</th>
              <th className="table-header-cell">Email de contact</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-cell text-center py-8">
                  <p className="text-accent">Aucune organisation trouvée</p>
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <motion.tr
                  key={org.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">{org.name}</td>
                  <td className="table-cell">{org.industry}</td>
                  <td className="table-cell">{org.contact_email}</td>
                  <td className="table-cell">
                    {org.is_active ? (
                      <span className="badge-success">Active</span>
                    ) : (
                      <span className="badge-danger">Inactive</span>
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
                        onClick={() => handleDelete(org.id)}
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

export default Organizations