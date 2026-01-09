"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import roleService from "../services/role.service"
import type { Role, RoleCreate, RoleUpdate } from "@/api"
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
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<Role>({
    fetchData: roleService.getRoles,
    defaultSortKey: "created_at",
    defaultSortDirection: "desc",
    clientSideSort: true, // API doesn't support sorting, so we sort client-side
    clientSideSearch: true, // API doesn't support search, so we search client-side
    searchKeys: ["name", "description"],
  })

  const handleOpenDialog = (role: Role | null = null) => {
    // Si role est passé, retrouver l'objet original dans data (car celui passé a permissions transformé en string)
    if (role) {
      const originalRole = data.find((r) => r.id === role.id) || null
      setSelectedRole(originalRole)
    } else {
      setSelectedRole(null)
    }
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
    // Retrouver l'objet original dans data
    const originalRole = data.find((r) => r.id === role.id) || role
    setRoleToDelete(originalRole)
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
    { key: "name", header: "Nom", sortable: true },
    { key: "description", header: "Description", sortable: true },
    { key: "permissions", header: "Permissions", sortable: false },
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

        <button
          type="button"
          onClick={() => handleOpenDialog()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau rôle</span>
        </button>
      </div>

      <DataTable
        data={data.map((r) => ({
          ...r,
          permissions: r.permissions?.map((p) => p.name).join(", ") || "-",
        })) as unknown as Role[]}
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
