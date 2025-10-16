"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import leaveService from "../services/leave.service"
import type { Leave, PaginationParams, LeaveStatus } from "../types"

const Leaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });

  const fetchLeaves = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leaveService.getLeaves(pagination)
      setLeaves(response.items)
    } catch (error) {
      console.error("Erreur lors de la récupération des congés:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande de congé ?")) {
      try {
        await leaveService.deleteLeave(id)
        fetchLeaves()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "pending":
        return <span className="badge-warning">En attente</span>
      case "approved":
        return <span className="badge-success">Approuvé</span>
      case "rejected":
        return <span className="badge-danger">Rejeté</span>
      case "cancelled":
        return <span className="badge">Annulé</span>
      default:
        return <span className="badge">{status}</span>
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des congés</h1>
          <p className="text-accent">Gérez les demandes de congés de vos employés</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle demande</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Rechercher par employé..."
            value={pagination.search}
            onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Tableau des congés */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Employé</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Date de début</th>
              <th className="table-header-cell">Date de fin</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-cell text-center py-8">
                  <p className="text-accent">Aucune demande de congé trouvée</p>
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <motion.tr
                  key={leave.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">{leave.employee?.first_name} {leave.employee?.last_name}</td>
                  <td className="table-cell">{leave.leave_type}</td>
                  <td className="table-cell">{leave.start_date}</td>
                  <td className="table-cell">{leave.end_date}</td>
                  <td className="table-cell">{getStatusBadge(leave.status)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(leave.id)}
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

export default Leaves