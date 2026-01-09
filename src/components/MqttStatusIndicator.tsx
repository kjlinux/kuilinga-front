"use client"

import { useState, useEffect, useCallback } from "react"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import deviceService, { type MqttStatus } from "@/services/device.service"

interface MqttStatusIndicatorProps {
  refreshInterval?: number // millisecondes, defaut 30000 (30s)
  showDetails?: boolean // afficher host:port dans le tooltip
}

const MqttStatusIndicator = ({
  refreshInterval = 30000,
  showDetails = true,
}: MqttStatusIndicatorProps) => {
  const [status, setStatus] = useState<MqttStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const mqttStatus = await deviceService.getMqttStatus()
      setStatus(mqttStatus)
      setError(false)
    } catch {
      setStatus({ connected: false, broker_host: null, broker_port: null })
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchStatus, refreshInterval])

  // Rafraichir manuellement au clic
  const handleClick = () => {
    setIsLoading(true)
    fetchStatus()
  }

  if (isLoading && status === null) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-xs text-gray-500 font-medium">MQTT...</span>
      </div>
    )
  }

  const tooltipText = showDetails
    ? status?.connected
      ? `Connecte a ${status.broker_host}:${status.broker_port}`
      : error
        ? "Erreur de connexion au broker MQTT"
        : "Deconnecte du broker MQTT"
    : status?.connected
      ? "MQTT Connecte"
      : "MQTT Deconnecte"

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:shadow-sm disabled:opacity-70 ${
        status?.connected
          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
      }`}
      title={tooltipText}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : status?.connected ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-xs font-medium">
        {status?.connected ? "MQTT" : "MQTT"}
      </span>
      <span
        className={`w-2 h-2 rounded-full ${
          status?.connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </button>
  )
}

export default MqttStatusIndicator
