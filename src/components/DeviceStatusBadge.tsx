"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Wrench,
} from "lucide-react"
import type { DeviceStatus } from "@/api"

// Interface etendue pour les champs heartbeat (fournis par le backend)
export interface DeviceHeartbeatInfo {
  status?: DeviceStatus
  last_seen_at?: string | null
  firmware_version?: string | null
  battery_level?: number | null
  wifi_rssi?: number | null
}

interface DeviceStatusBadgeProps {
  device: DeviceHeartbeatInfo
  showDetails?: boolean
}

const DeviceStatusBadge = ({
  device,
  showDetails = false,
}: DeviceStatusBadgeProps) => {
  const status = device.status ?? "offline"

  const getStatusConfig = (s: DeviceStatus) => {
    switch (s) {
      case "online":
        return {
          label: "En ligne",
          bgClass: "bg-green-50",
          textClass: "text-green-700",
          borderClass: "border-green-200",
          dotClass: "bg-green-500",
          Icon: Wifi,
        }
      case "offline":
        return {
          label: "Hors ligne",
          bgClass: "bg-red-50",
          textClass: "text-red-700",
          borderClass: "border-red-200",
          dotClass: "bg-red-500",
          Icon: WifiOff,
        }
      case "maintenance":
        return {
          label: "Maintenance",
          bgClass: "bg-yellow-50",
          textClass: "text-yellow-700",
          borderClass: "border-yellow-200",
          dotClass: "bg-yellow-500",
          Icon: Wrench,
        }
      default:
        return {
          label: "Inconnu",
          bgClass: "bg-gray-50",
          textClass: "text-gray-700",
          borderClass: "border-gray-200",
          dotClass: "bg-gray-500",
          Icon: WifiOff,
        }
    }
  }

  const getBatteryIcon = (level: number | null | undefined) => {
    if (level === null || level === undefined) return null
    if (level >= 80) return <BatteryFull className="w-4 h-4 text-green-600" />
    if (level >= 50) return <BatteryMedium className="w-4 h-4 text-green-600" />
    if (level >= 20) return <BatteryLow className="w-4 h-4 text-yellow-600" />
    return <Battery className="w-4 h-4 text-red-600" />
  }

  const getSignalIcon = (rssi: number | null | undefined) => {
    if (rssi === null || rssi === undefined) return null
    // RSSI: -30 excellent, -50 bon, -70 faible, -90 tres faible
    if (rssi >= -50) return <SignalHigh className="w-4 h-4 text-green-600" />
    if (rssi >= -70) return <SignalMedium className="w-4 h-4 text-yellow-600" />
    return <SignalLow className="w-4 h-4 text-red-600" />
  }

  const getLastSeenText = () => {
    if (!device.last_seen_at) return "Jamais vu"
    try {
      return `Vu ${formatDistanceToNow(new Date(device.last_seen_at), {
        addSuffix: true,
        locale: fr,
      })}`
    } catch {
      return "Date invalide"
    }
  }

  const { label, bgClass, textClass, borderClass, dotClass, Icon } =
    getStatusConfig(status)

  const tooltipContent = [
    getLastSeenText(),
    device.firmware_version && `Firmware: ${device.firmware_version}`,
    device.battery_level != null && `Batterie: ${device.battery_level}%`,
    device.wifi_rssi != null && `Signal WiFi: ${device.wifi_rssi} dBm`,
  ]
    .filter(Boolean)
    .join(" | ")

  return (
    <div className="flex items-center gap-2" title={tooltipContent}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bgClass} ${textClass} ${borderClass}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {label}
      </span>

      {showDetails && status === "online" && (
        <div className="flex items-center gap-1">
          {getBatteryIcon(device.battery_level)}
          {getSignalIcon(device.wifi_rssi)}
        </div>
      )}
    </div>
  )
}

export default DeviceStatusBadge
