"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import employeeService from "../services/employee.service"
import type { Employee, EmployeeCreate, EmployeeUpdate } from "../types"
import EmployeeDialog from "../components/EmployeeDialog"
import ConfirmationDialog from "../components/ConfirmationDialog"

const Employees = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  )

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Employee>({
    fetchData: employeeService.getEmployees,
  })

  const handleOpenDialog = (employee: Employee | null = null) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: EmployeeCreate | EmployeeUpdate) => {
    const isEditing = !!selectedEmployee
    const action = isEditing
      ? employeeService.updateEmployee(
          selectedEmployee.id,
          formData as EmployeeUpdate,
        )
      : employeeService.createEmployee(formData as EmployeeCreate)

    toast.promise(action, {
      loading: "Sauvegarde de l'employé en cours...",
      success: `Employé ${isEditing ? "mis à jour" : "créé"} avec succès !`,
      error: "Erreur lors de la sauvegarde de l'employé.",
    })

    try {
      await action
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'employé:", error)
    }
  }

  const handleDeleteRequest = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return

    const action = employeeService.deleteEmployee(employeeToDelete.id)

    toast.promise(action, {
      loading: "Suppression de l'employé en cours...",
      success: "Employé supprimé avec succès !",
      error: "Erreur lors de la suppression de l'employé.",
    })

    try {
      await action
      refresh()
      setIsConfirmOpen(false)
      setEmployeeToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const columns = [
    { key: "employee_number", header: "N° Employé" },
    { key: "first_name", header: "Prénom" },
    { key: "last_name", header: "Nom" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Téléphone" },
    { key: "position", header: "Poste" },
    { key: "department", header: "Département" },
    { key: "site", header: "Site" },
    { key: "badge_id", header: "N° Badge" },
    { key: "status", header: "Statut" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Gestion des employés
          </h1>
          <p className="text-accent">Gérez les employés et leurs informations</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importer</span>
          </button>
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel employé</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map((e) => ({
          ...e,
          department: e.department?.name,
          site: e.site?.name,
        }))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteRequest}
      />

      <EmployeeDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        employee={selectedEmployee}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer l'employé "${employeeToDelete?.full_name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Employees