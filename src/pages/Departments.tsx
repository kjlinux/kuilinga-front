"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import departmentService from "../services/department.service"
import type { Department, DepartmentCreate, DepartmentUpdate } from "../types"
import DepartmentDialog from "../components/DepartmentDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Departments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Department>({
    fetchData: departmentService.getDepartments,
  })

  const handleOpenDialog = (department?: Department | null) => {
    setSelectedDepartment(department || null)
    setIsDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    handleOpenDialog(department)
  }

  const handleCloseDialog = () => {
    setSelectedDepartment(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (
    formData: DepartmentCreate | DepartmentUpdate,
  ) => {
    const isEditing = !!selectedDepartment
    const action = isEditing
      ? departmentService.updateDepartment(
          selectedDepartment.id,
          formData as DepartmentUpdate,
        )
      : departmentService.createDepartment(formData as DepartmentCreate)

    toast.promise(action, {
      loading: `Sauvegarde du département en cours...`,
      success: `Département ${
        isEditing ? "mis à jour" : "créé"
      } avec succès !`,
      error: `Erreur lors de la sauvegarde du département.`,
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du département:", error)
    }
  }

  const handleDeleteRequest = (department: Department) => {
    setDepartmentToDelete(department)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return

    const action = departmentService.deleteDepartment(departmentToDelete.id)

    toast.promise(action, {
      loading: "Suppression du département en cours...",
      success: "Département supprimé avec succès !",
      error: "Erreur lors de la suppression du département.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setDepartmentToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const columns = [
    { accessorKey: "name", header: "Nom" },
    { accessorKey: "site", header: "Site" },
    { accessorKey: "manager", header: "Manager" },
    { accessorKey: "employees_count", header: "N° Employés" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des départements
          </h1>
          <p className="text-accent">Gérez les départements de vos sites</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            data-tour="org-add"
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau département</span>
          </button>
        </div>
      </div>

      <div data-tour="org-departments">
        <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />
      </div>

      <DepartmentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        department={selectedDepartment}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer le département "${departmentToDelete?.name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Departments