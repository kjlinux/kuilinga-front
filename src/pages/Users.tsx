"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import userService from "../services/user.service"
import type { User, UserCreate, UserUpdate } from "@/api"
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
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<User>({
    fetchData: userService.getUsers,
    defaultSortKey: "full_name",
    defaultSortDirection: "asc",
  })

  const handleOpenDialog = (user: User | null = null) => {
    // Si user est passé, retrouver l'objet original dans data (car celui passé a roles transformé en string)
    if (user) {
      const originalUser = data.find((u) => u.id === user.id) || null
      setSelectedUser(originalUser)
    } else {
      setSelectedUser(null)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: UserCreate | UserUpdate) => {
    const isEditing = !!selectedUser
    const action = isEditing
      ? userService.updateUser(selectedUser.id, formData as UserUpdate)
      : userService.createUser(formData as UserCreate)

    toast.promise(action, {
      loading: "Sauvegarde de l'utilisateur en cours...",
      success: `Utilisateur ${isEditing ? "mis à jour" : "créé"} avec succès !`,
      error: "Erreur lors de la sauvegarde de l'utilisateur.",
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error)
    }
  }

  const handleDeleteRequest = (user: User) => {
    // Retrouver l'objet original dans data
    const originalUser = data.find((u) => u.id === user.id) || user
    setUserToDelete(originalUser)
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
    { key: "full_name", header: "Nom complet", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "roles", header: "Rôles", sortable: false },
    { key: "status", header: "Statut", sortable: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-accent">Gérez les utilisateurs et leurs accès</p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenDialog()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouvel utilisateur</span>
        </button>
      </div>

      <DataTable
        data={data.map((u) => ({
          ...u,
          roles: u.roles?.map((r) => r.name).join(", ") || "-",
          status: u.is_active ? "Actif" : "Inactif",
        })) as unknown as User[]}
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
