"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import leaveService from "../services/leave.service"
import type { Leave, LeaveCreate, LeaveUpdate, LeaveStatus } from "../types"
import LeaveDialog from "../components/LeaveDialog"

const Leaves = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Leave>({
    fetchData: leaveService.getLeaves,
  })

  const handleOpenDialog = (leave: Leave | null = null) => {
    setSelectedLeave(leave)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedLeave(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: LeaveCreate | LeaveUpdate) => {
    try {
      if (selectedLeave) {
        await leaveService.updateLeave(selectedLeave.id, formData as LeaveUpdate)
      } else {
        await leaveService.createLeave(formData as LeaveCreate)
      }
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la demande de congé:", error)
    }
  }

  const handleDelete = async (leave: Leave) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande de congé ?")) {
      try {
        await leaveService.deleteLeave(leave.id)
        refresh()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "approved":
        return "Approuvé"
      case "rejected":
        return "Rejeté"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const columns = [
    { key: "employee", header: "Employé" },
    { key: "leave_type", header: "Type" },
    { key: "start_date", header: "Date début" },
    { key: "end_date", header: "Date fin" },
    { key: "duration", header: "Durée" },
    { key: "reason", header: "Raison" },
    { key: "status", header: "Statut" },
    { key: "approver", header: "Approbateur" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des congés</h1>
          <p className="text-accent">Gérez les demandes de congés de vos employés</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle demande</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map(l => ({
          ...l,
          employee: l.employee?.full_name,
          start_date: new Date(l.start_date).toLocaleDateString(),
          end_date: new Date(l.end_date).toLocaleDateString(),
          duration: `${l.duration} jours`,
          status: getStatusBadge(l.status),
          approver: l.approver?.full_name,
        }))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <LeaveDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        leave={selectedLeave}
      />
    </div>
  )
}

export default Leaves