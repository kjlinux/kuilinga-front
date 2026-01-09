"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Check, X, Send, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import deviceService, {
  DEVICE_COMMAND_CODES,
  DEVICE_COMMAND_LABELS,
} from "@/services/device.service"
import type { DeviceCommandType, DeviceBulkCommandResponse } from "@/api"
import ConfirmationDialog from "./ConfirmationDialog"

interface BulkDeviceActionsProps {
  selectedDeviceIds: string[]
  onComplete?: () => void
  onClearSelection?: () => void
}

const COMMAND_OPTIONS: DeviceCommandType[] = ["status", "reboot", "reset", "sleep"]

// Commandes qui necessitent une confirmation
const COMMANDS_REQUIRING_CONFIRMATION: DeviceCommandType[] = ["reboot", "reset", "sleep"]

const BulkDeviceActions = ({
  selectedDeviceIds,
  onComplete,
  onClearSelection,
}: BulkDeviceActionsProps) => {
  const [command, setCommand] = useState<DeviceCommandType>("status")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DeviceBulkCommandResponse | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleExecuteClick = () => {
    if (COMMANDS_REQUIRING_CONFIRMATION.includes(command)) {
      setShowConfirmDialog(true)
    } else {
      executeCommand()
    }
  }

  const executeCommand = async () => {
    if (selectedDeviceIds.length === 0) return

    setShowConfirmDialog(false)
    setIsLoading(true)

    try {
      const response = await deviceService.sendBulkCommand(
        selectedDeviceIds,
        command
      )
      setResult(response)
      setShowResultDialog(true)

      if (response.failed === 0) {
        toast.success(
          `${response.successful}/${response.total_devices} commandes envoyees avec succes`
        )
      } else if (response.successful > 0) {
        toast.warning(
          `${response.successful} succes, ${response.failed} echecs sur ${response.total_devices} terminaux`
        )
      } else {
        toast.error(
          `Echec: ${response.failed}/${response.total_devices} commandes`
        )
      }

      onComplete?.()
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail || "Erreur lors de l'envoi des commandes"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseResult = () => {
    setShowResultDialog(false)
    setResult(null)
    onClearSelection?.()
  }

  if (selectedDeviceIds.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <span className="text-sm font-medium text-blue-700">
          {selectedDeviceIds.length} terminal
          {selectedDeviceIds.length > 1 ? "aux" : ""} selectionne
          {selectedDeviceIds.length > 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={command}
            onValueChange={(v) => setCommand(v as DeviceCommandType)}
          >
            <SelectTrigger className="w-52 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMAND_OPTIONS.map((cmd) => (
                <SelectItem key={cmd} value={cmd}>
                  <span className="flex items-center gap-2">
                    {DEVICE_COMMAND_LABELS[cmd]}
                    <span className="text-xs text-gray-400">
                      ({DEVICE_COMMAND_CODES[cmd]})
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleExecuteClick}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Executer
          </Button>

          <Button variant="outline" onClick={onClearSelection}>
            <XCircle className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>

      {/* Dialog de confirmation pour commandes critiques */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={executeCommand}
        title={`Confirmer ${DEVICE_COMMAND_LABELS[command].toLowerCase()}`}
        description={`Etes-vous sur de vouloir ${DEVICE_COMMAND_LABELS[command].toLowerCase()} ${selectedDeviceIds.length} terminal${selectedDeviceIds.length > 1 ? "aux" : ""} ?`}
      />

      {/* Dialog de resultats */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resultats de l'envoi groupe</DialogTitle>
            <DialogDescription>
              Commande: {DEVICE_COMMAND_LABELS[command]} (
              {DEVICE_COMMAND_CODES[command]})
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div
                className={`p-3 rounded-lg font-medium ${
                  result.failed === 0
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : result.successful > 0
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {result.successful} / {result.total_devices} commandes envoyees
                avec succes
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {result.results.map((r, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 border rounded-lg ${
                      r.success
                        ? "border-green-200 bg-green-50/50"
                        : "border-red-200 bg-red-50/50"
                    }`}
                  >
                    {r.success ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-secondary truncate">
                        {r.device_serial}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {r.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Code: {r.command_code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleCloseResult}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BulkDeviceActions
