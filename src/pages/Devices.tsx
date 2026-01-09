"use client"

import { useState, useCallback } from "react"
import { Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import useDevicePolling from "../hooks/useDevicePolling"
import deviceService from "../services/device.service"
import type { Device, DeviceCreate, DeviceUpdate } from "@/api"
import DeviceDialog from "../components/DeviceDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"
import DeviceActionsDropdown from "../components/DeviceActionsDropdown"
import BulkDeviceActions from "../components/BulkDeviceActions"
import MqttStatusIndicator from "../components/MqttStatusIndicator"
import DeviceStatusBadge from "../components/DeviceStatusBadge"

// Interface etendue pour les champs heartbeat (disponibles quand le backend est mis a jour)
interface DeviceWithHeartbeat extends Device {
  last_seen_at?: string | null
  firmware_version?: string | null
  battery_level?: number | null
  wifi_rssi?: number | null
}

const Devices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null)
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([])

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

  // Rafraichissement automatique toutes les 30 secondes
  const refreshAsync = useCallback(async () => {
    refresh()
  }, [refresh])

  useDevicePolling(refreshAsync, { intervalMs: 30000 })

  // Calcul des statistiques online/offline
  const onlineCount = data.filter((d) => d.status === "online").length
  const offlineCount = data.filter((d) => d.status === "offline").length

  // Formater la derniere activite (last_seen_at)
  const formatLastSeen = (lastSeenAt?: string | null) => {
    if (!lastSeenAt) return "-"
    try {
      return formatDistanceToNow(new Date(lastSeenAt), {
        addSuffix: true,
        locale: fr,
      })
    } catch {
      return "-"
    }
  }

  // Afficher le niveau de batterie avec couleur
  const renderBatteryLevel = (level?: number | null) => {
    if (level === null || level === undefined) return "-"
    const colorClass =
      level < 20
        ? "text-red-600"
        : level < 50
          ? "text-yellow-600"
          : "text-green-600"
    return <span className={`font-medium ${colorClass}`}>{level}%</span>
  }

  const columns = [
    { key: "serial_number", header: "N° Serie", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "status", header: "Statut", sortable: false },
    { key: "organization", header: "Organisation", sortable: false },
    { key: "site", header: "Site", sortable: false },
    { key: "last_seen_at", header: "Derniere Activite", sortable: false },
    { key: "firmware_version", header: "Firmware", sortable: false },
    { key: "battery_level", header: "Batterie", sortable: false },
    { key: "daily_attendance_count", header: "Pointages", sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des terminaux
          </h1>
          <p className="text-accent">
            {onlineCount} en ligne - {offlineCount} hors ligne
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MqttStatusIndicator />
          <button
            type="button"
            onClick={() => refresh()}
            className="btn-icon"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau terminal</span>
          </button>
        </div>
      </div>

      {/* Alerte si beaucoup de terminaux offline */}
      {offlineCount > data.length / 2 && data.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-yellow-600 font-medium">Attention :</span>
          <span className="text-yellow-700">
            Plus de la moitie des terminaux sont hors ligne. Verifiez la connexion reseau ou le broker MQTT.
          </span>
        </div>
      )}

      {/* Toolbar pour actions groupees */}
      <BulkDeviceActions
        selectedDeviceIds={selectedDeviceIds}
        onComplete={refresh}
        onClearSelection={() => setSelectedDeviceIds([])}
      />

      <DataTable
        data={data.map((d) => {
          const device = d as DeviceWithHeartbeat
          return {
            ...d,
            status: <DeviceStatusBadge device={device} showDetails />,
            organization: d.organization?.name || "-",
            site: d.site?.name || "-",
            last_seen_at: formatLastSeen(device.last_seen_at),
            firmware_version: device.firmware_version || "-",
            battery_level: renderBatteryLevel(device.battery_level),
          }
        }) as unknown as Device[]}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        sortConfig={sortConfig}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRequest}
        selectable
        selectedIds={selectedDeviceIds}
        onSelectionChange={setSelectedDeviceIds}
        renderActions={(item) => {
          // Retrouver le device original pour avoir toutes les props
          const originalDevice = data.find((d) => d.id === item.id)
          if (!originalDevice) return null
          return (
            <DeviceActionsDropdown
              device={originalDevice}
              onCommandSuccess={refresh}
            />
          )
        }}
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