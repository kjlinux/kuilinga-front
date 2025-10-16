"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import deviceService from "../services/device.service"
import type { Device, PaginationParams, DeviceStatus } from "../types"

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  });

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await deviceService.getDevices(pagination)
      setDevices(response.items)
    } catch (error) {
      console.error("Erreur lors de la récupération des terminaux:", error)
    } finally {
      setIsLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce terminal ?")) {
      try {
        await deviceService.deleteDevice(id)
        fetchDevices()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return <span className="badge-success">En ligne</span>
      case "offline":
        return <span className="badge-danger">Hors ligne</span>
      case "maintenance":
        return <span className="badge-warning">Maintenance</span>
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
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des terminaux</h1>
          <p className="text-accent">Gérez les terminaux (pointeuses) de vos organisations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau terminal</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Rechercher par numéro de série..."
            value={pagination.search}
            onChange={(e) => setPagination({ ...pagination, search: e.target.value })}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Tableau des terminaux */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Numéro de série</th>
              <th className="table-header-cell">Modèle</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">ID Organisation</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {devices.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-cell text-center py-8">
                  <p className="text-accent">Aucun terminal trouvé</p>
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <motion.tr
                  key={device.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="table-cell">{device.serial_number}</td>
                  <td className="table-cell">{device.model}</td>
                  <td className="table-cell">{getStatusBadge(device.status)}</td>
                  <td className="table-cell">{device.organization_id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(device.id)}
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

export default Devices