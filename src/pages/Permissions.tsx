"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import permissionService from "../services/permission.service"
import type { Permission, PermissionCreate, PermissionUpdate } from "@/api"
import PermissionDialog from "../components/PermissionDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Permissions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null)

  const {
    data,
    isLoading,
    pagination,
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<Permission>({
    fetchData: permissionService.getPermissions,
    defaultSortKey: "created_at",
    defaultSortDirection: "desc",
    clientSideSort: true, // API doesn't support sorting, so we sort client-side
    clientSideSearch: true, // API doesn't support search, so we search client-side
    searchKeys: ["name", "description"],
  })

  const handleOpenDialog = (permission: Permission | null = null) => {
    setSelectedPermission(permission)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedPermission(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: PermissionCreate | PermissionUpdate) => {
    const isEditing = !!selectedPermission
    const action = isEditing
      ? permissionService.updatePermission(selectedPermission.id, formData as PermissionUpdate)
      : permissionService.createPermission(formData as PermissionCreate)

    toast.promise(action, {
      loading: "Sauvegarde de la permission en cours...",
      success: `Permission ${isEditing ? "mise à jour" : "créée"} avec succès !`,
      error: "Erreur lors de la sauvegarde de la permission.",
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la permission:", error)
    }
  }

  const handleDeleteRequest = (permission: Permission) => {
    setPermissionToDelete(permission)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return

    const action = permissionService.deletePermission(permissionToDelete.id)

    toast.promise(action, {
      loading: "Suppression de la permission en cours...",
      success: "Permission supprimée avec succès !",
      error: "Erreur lors de la suppression de la permission.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setPermissionToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const columns = [
    { key: "name", header: "Nom", sortable: true },
    { key: "description", header: "Description", sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des permissions
          </h1>
          <p className="text-accent">Gérez les permissions du système</p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenDialog()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouvelle permission</span>
        </button>
      </div>

      <DataTable
        data={data}
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

      <PermissionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        permission={selectedPermission}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer la permission "${permissionToDelete?.name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Permissions
