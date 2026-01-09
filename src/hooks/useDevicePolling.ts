import { useEffect, useCallback, useRef } from "react"

interface UseDevicePollingOptions {
  enabled?: boolean
  intervalMs?: number
}

/**
 * Hook pour rafraichir automatiquement les donnees des terminaux
 * selon un intervalle configurable (par defaut 30 secondes).
 *
 * @param fetchDevices - Fonction a appeler pour recuperer les terminaux
 * @param options - Options de configuration
 * @returns { startPolling, stopPolling } - Fonctions pour controler le polling
 */
export const useDevicePolling = (
  fetchDevices: () => Promise<void>,
  options: UseDevicePollingOptions = {}
) => {
  const { enabled = true, intervalMs = 30000 } = options
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fetchRef = useRef(fetchDevices)

  // Toujours garder la reference a jour
  useEffect(() => {
    fetchRef.current = fetchDevices
  }, [fetchDevices])

  const startPolling = useCallback(() => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      fetchRef.current()
    }, intervalMs)
  }, [intervalMs])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      // Fetch initial deja fait par useDataTable, on demarre juste le polling
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [enabled, startPolling, stopPolling])

  // Pause le polling quand la page n'est pas visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else if (enabled) {
        // Rafraichir immediatement quand on revient sur la page
        fetchRef.current()
        startPolling()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [enabled, startPolling, stopPolling])

  return { startPolling, stopPolling }
}

export default useDevicePolling
