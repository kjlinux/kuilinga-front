"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import deviceService from "../services/device.service"
import type { Device, DeviceCreate, DeviceUpdate, DeviceStatus } from "../types"
import DeviceDialog from "../components/DeviceDialog"

const Devices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Device>({
    fetchData: deviceService.getDevices,
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
    try {
      if (selectedDevice) {
        await deviceService.updateDevice(selectedDevice.id, formData as DeviceUpdate)
      } else {
        await deviceService.createDevice(formData as DeviceCreate)
      }
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du terminal:", error)
    }
  }

  const handleDelete = async (device: Device) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce terminal ?")) {
      try {
        await deviceService.deleteDevice(device.id)
        refresh()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
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
    { key: "serial_number", header: "N° Série" },
    { key: "type", header: "Type" },
    { key: "status", header: "Statut" },
    { key: "organization", header: "Organisation" },
    { key: "site", header: "Site" },
    { key: "last_attendance_timestamp", header: "Dernier Pointage" },
    { key: "daily_attendance_count", header: "Pointages du Jour" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des terminaux</h1>
          <p className="text-accent">Gérez les terminaux (pointeuses) de vos organisations</p>
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
        data={data.map(d => ({
          ...d,
          status: getStatusBadge(d.status),
          organization: d.organization?.name,
          site: d.site?.name,
          last_attendance_timestamp: d.last_attendance_timestamp
            ? new Date(d.last_attendance_timestamp).toLocaleString()
            : "N/A",
        }))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <DeviceDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        device={selectedDevice}
      />
    </div>
  )
}

export default Devices