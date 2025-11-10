"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import userService from "../services/user.service"
import type { User, UserCreate, UserUpdate } from "../types"
import UserDialog from "../components/UserDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<User>({
    fetchData: userService.getUsers,
  })

  const handleOpenDialog = (user: User | null = null) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: UserCreate | UserUpdate, roleId: string) => {
    try {
      const isEditing = !!selectedUser

      // Step 1: Create or update the user
      const savedUser = isEditing
        ? await userService.updateUser(selectedUser.id, formData as UserUpdate)
        : await userService.createUser(formData as UserCreate)

      // Step 2: Assign role to user
      if (roleId) {
        await userService.assignRoleToUser(savedUser.id, roleId)
      }

      toast.success(`Utilisateur ${isEditing ? "mis à jour" : "créé"} avec succès !`)
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error)
      toast.error("Erreur lors de la sauvegarde de l'utilisateur.")
    }
  }

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    const action = userService.deleteUser(userToDelete.id)

    toast.promise(action, {
      loading: "Suppression de l'utilisateur en cours...",
      success: "Utilisateur supprimé avec succès !",
      error: "Erreur lors de la suppression de l'utilisateur.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const columns = [
    { accessorKey: "full_name", header: "Nom complet" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "roles", header: "Rôles", cell: ({ row }: any) => row.original.roles?.map((r: any) => r.name).join(", ") || "N/A" },
    { accessorKey: "is_active", header: "Statut", cell: ({ row }: any) => row.original.is_active ? "Actif" : "Inactif" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-accent">Gérez les utilisateurs du système</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel utilisateur</span>
          </button>
        </div>
      </div>

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

      <UserDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        user={selectedUser}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.full_name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Users
