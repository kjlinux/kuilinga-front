"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import departmentService from "../services/department.service"
import type { Department, DepartmentCreate, DepartmentUpdate } from "../types"
import DepartmentDialog from "../components/DepartmentDialog"

const Departments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)

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

  const handleOpenDialog = (department: Department | null = null) => {
    setSelectedDepartment(department)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedDepartment(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: DepartmentCreate | DepartmentUpdate) => {
    try {
      if (selectedDepartment) {
        await departmentService.updateDepartment(selectedDepartment.id, formData as DepartmentUpdate)
      } else {
        await departmentService.createDepartment(formData as DepartmentCreate)
      }
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du département:", error)
    }
  }

  const handleDelete = async (department: Department) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      try {
        await departmentService.deleteDepartment(department.id)
        refresh()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns = [
    { key: "name", header: "Nom" },
    { key: "site", header: "Site" },
    { key: "manager", header: "Manager" },
    { key: "employees_count", header: "N° Employés" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des départements</h1>
          <p className="text-accent">Gérez les départements de vos sites</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau département</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map(d => ({...d, site: d.site?.name, manager: d.manager?.full_name}))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <DepartmentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        department={selectedDepartment}
      />
    </div>
  )
}

export default Departments