"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import siteService from "../services/site.service"
import type { Site, Filter } from "../types"

const Sites = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filter>({
    search: "",
  })

  const fetchSites = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await siteService.getSites(1, 20, filters)
      setSites(response.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des sites:", error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      try {
        await siteService.deleteSite(id)
        fetchSites()
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des sites</h1>
          <p className="text-accent">Gérez les sites de vos organisations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau site</span>
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
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Tableau des sites */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Nom</th>
              <th className="table-header-cell">Localisation</th>
              <th className="table-header-cell">Fuseau horaire</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sites.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-cell text-center py-8">
                  <p className="text-accent">Aucun site trouvé</p>
                </td>
              </tr>
            ) : (
              sites.map((site) => (
                <motion.tr
                  key={site.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">{site.name}</td>
                  <td className="table-cell">{site.location}</td>
                  <td className="table-cell">{site.timezone}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(site.id)}
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

export default Sites
