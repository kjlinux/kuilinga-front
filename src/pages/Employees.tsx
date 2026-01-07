"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import employeeService from "../services/employee.service"
import type { Employee, EmployeeCreate, EmployeeUpdate } from "@/api"
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
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<Employee>({
    fetchData: employeeService.getEmployees,
    defaultSortKey: "last_name",
    defaultSortDirection: "asc",
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
    { key: "employee_number", header: "N° Employé", sortable: true },
    { key: "first_name", header: "Prénom", sortable: true },
    { key: "last_name", header: "Nom", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "phone", header: "Téléphone", sortable: false },
    { key: "position", header: "Poste", sortable: true },
    { key: "department", header: "Département", sortable: false },
    { key: "site", header: "Site", sortable: false },
    { key: "badge_id", header: "N° Badge", sortable: true },
    { key: "status", header: "Statut", sortable: false },
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

        <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel employé</span>
          </button>
      </div>

      <DataTable
        data={data.map((e) => ({
          ...e,
          department: e.department?.name,
          site: e.site?.name,
        })) as unknown as Employee[]}
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
        description={`Êtes-vous sûr de vouloir supprimer l'employé "${employeeToDelete?.first_name} ${employeeToDelete?.last_name}" ? Cette action est irréversible.`}
      />
    </div>
  )
}

export default Employees