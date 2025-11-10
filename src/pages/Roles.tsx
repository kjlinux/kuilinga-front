"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import roleService from "../services/role.service"
import type { Role, RoleCreate, RoleUpdate } from "../types"
import RoleDialog from "../components/RoleDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Roles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Role>({
    fetchData: roleService.getRoles,
  })

  const handleOpenDialog = (role: Role | null = null) => {
    setSelectedRole(role)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedRole(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: RoleCreate | RoleUpdate) => {
    const isEditing = !!selectedRole
    const action = isEditing
      ? roleService.updateRole(selectedRole.id, formData as RoleUpdate)
      : roleService.createRole(formData as RoleCreate)

    toast.promise(action, {
      loading: "Sauvegarde du rôle en cours...",
      success: `Rôle ${isEditing ? "mis à jour" : "créé"} avec succès !`,
      error: "Erreur lors de la sauvegarde du rôle.",
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rôle:", error)
    }
  }

  const handleDeleteRequest = (role: Role) => {
    setRoleToDelete(role)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return

    const action = roleService.deleteRole(roleToDelete.id)

    toast.promise(action, {
      loading: "Suppression du rôle en cours...",
      success: "Rôle supprimé avec succès !",
      error: "Erreur lors de la suppression du rôle.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setRoleToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const columns = [
    { accessorKey: "name", header: "Nom" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }: any) => {
        const permissions = row.original.permissions;
        return <span>{permissions?.map((p: any) => p.name).join(", ") || "Aucune"}</span>;
      }
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des rôles
          </h1>
          <p className="text-accent">Gérez les rôles et leurs permissions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            data-tour="admin-add"
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau rôle</span>
          </button>
        </div>
      </div>

      <div data-tour="roles-system">
        <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRequest}
      />
      </div>

      <RoleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        role={selectedRole}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le rôle "${roleToDelete?.name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Roles
