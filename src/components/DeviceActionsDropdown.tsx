"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreVertical,
  RefreshCw,
  Power,
  Moon,
  Activity,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import deviceService, { DEVICE_COMMAND_CODES } from "@/services/device.service"
import type { Device, DeviceCommandType } from "@/api"
import ConfirmationDialog from "./ConfirmationDialog"

interface DeviceActionsDropdownProps {
  device: Device
  onCommandSuccess?: () => void
}

interface CommandConfig {
  type: DeviceCommandType
  label: string
  icon: typeof RefreshCw
  requiresConfirmation: boolean
  confirmTitle: string
  confirmDescription: (serial: string) => string
}

const COMMANDS: CommandConfig[] = [
  {
    type: "status",
    label: "Demander statut",
    icon: Activity,
    requiresConfirmation: false,
    confirmTitle: "",
    confirmDescription: () => "",
  },
  {
    type: "reboot",
    label: "Redemarrer",
    icon: RefreshCw,
    requiresConfirmation: true,
    confirmTitle: "Confirmer le redemarrage",
    confirmDescription: (serial) =>
      `Etes-vous sur de vouloir redemarrer le terminal "${serial}" ? Le terminal sera temporairement indisponible.`,
  },
  {
    type: "reset",
    label: "Reinitialiser",
    icon: Power,
    requiresConfirmation: true,
    confirmTitle: "Confirmer la reinitialisation",
    confirmDescription: (serial) =>
      `Etes-vous sur de vouloir reinitialiser le terminal "${serial}" ? Cette action restaurera les parametres par defaut.`,
  },
  {
    type: "sleep",
    label: "Mettre en veille",
    icon: Moon,
    requiresConfirmation: true,
    confirmTitle: "Confirmer la mise en veille",
    confirmDescription: (serial) =>
      `Etes-vous sur de vouloir mettre en veille le terminal "${serial}" ?`,
  },
]

const DeviceActionsDropdown = ({
  device,
  onCommandSuccess,
}: DeviceActionsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingCommand, setPendingCommand] = useState<CommandConfig | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown lors d'un clic exterieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const executeCommand = async (commandType: DeviceCommandType) => {
    setIsLoading(true)
    setIsOpen(false)
    setPendingCommand(null)

    try {
      const response = await deviceService.sendCommand(device.id, commandType)
      toast.success(response.message, {
        description: `Code: ${response.command_code}`,
      })
      onCommandSuccess?.()
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Erreur lors de l'envoi de la commande"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommandClick = (cmd: CommandConfig) => {
    setIsOpen(false)
    if (cmd.requiresConfirmation) {
      setPendingCommand(cmd)
    } else {
      executeCommand(cmd.type)
    }
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Actions IoT"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <MoreVertical className="w-4 h-4 text-accent" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div className="p-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
                  Commandes IoT
                </div>
                {COMMANDS.map((cmd) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.type}
                      onClick={() => handleCommandClick(cmd)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left group"
                    >
                      <Icon className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
                      <div className="flex-1">
                        <span className="text-sm text-secondary block">
                          {cmd.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {DEVICE_COMMAND_CODES[cmd.type]}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {pendingCommand && (
        <ConfirmationDialog
          isOpen={!!pendingCommand}
          onClose={() => setPendingCommand(null)}
          onConfirm={() => executeCommand(pendingCommand.type)}
          title={pendingCommand.confirmTitle}
          description={pendingCommand.confirmDescription(device.serial_number)}
        />
      )}
    </>
  )
}

export default DeviceActionsDropdown
