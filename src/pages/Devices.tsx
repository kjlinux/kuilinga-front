"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import deviceService from "../services/device.service"
import type { Device, DeviceCreate, DeviceUpdate, DeviceStatus } from "@/api"
import DeviceDialog from "../components/DeviceDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Devices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null)

  const {
    data,
    isLoading,
    pagination,
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<Device>({
    fetchData: deviceService.getDevices,
    defaultSortKey: "serial_number",
    defaultSortDirection: "asc",
  })

  const handleOpenDialog = (device: Device | null = null) => {
    setSelectedDevice(device)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedDevice(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: DeviceCreate | DeviceUpdate) => {
    const isEditing = !!selectedDevice
    const action = isEditing
      ? deviceService.updateDevice(selectedDevice.id, formData as DeviceUpdate)
      : deviceService.createDevice(formData as DeviceCreate)

    toast.promise(action, {
      loading: "Sauvegarde du terminal en cours...",
      success: `Terminal ${isEditing ? "mis à jour" : "créé"} avec succès !`,
      error: "Erreur lors de la sauvegarde du terminal.",
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du terminal:", error)
    }
  }

  const handleDeleteRequest = (device: Device) => {
    setDeviceToDelete(device)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return

    const action = deviceService.deleteDevice(deviceToDelete.id)

    toast.promise(action, {
      loading: "Suppression du terminal en cours...",
      success: "Terminal supprimé avec succès !",
      error: "Erreur lors de la suppression du terminal.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setDeviceToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return "En ligne"
      case "offline":
        return "Hors ligne"
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  const columns = [
    { key: "serial_number", header: "N° Série", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "status", header: "Statut", sortable: false },
    { key: "organization", header: "Organisation", sortable: false },
    { key: "site", header: "Site", sortable: false },
    { key: "last_attendance_timestamp", header: "Dernier Pointage", sortable: false },
    { key: "daily_attendance_count", header: "Pointages du Jour", sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des terminaux
          </h1>
          <p className="text-accent">
            Gérez les terminaux (pointeuses) de vos organisations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau terminal</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map((d) => ({
          ...d,
          status: getStatusBadge(d.status ?? 'offline'),
          organization: d.organization?.name,
          site: d.site?.name,
          last_attendance_timestamp: d.last_attendance_timestamp
            ? new Date(d.last_attendance_timestamp).toLocaleString()
            : "N/A",
        })) as unknown as Device[]}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        sortConfig={sortConfig}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRequest}
      />

      <DeviceDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        device={selectedDevice}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le terminal "${deviceToDelete?.serial_number}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Devices