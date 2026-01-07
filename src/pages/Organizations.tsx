"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import organizationService from "../services/organization.service"
import type { Organization, OrganizationCreate, OrganizationUpdate } from "@/api"
import OrganizationDialog from "../components/OrganizationDialog"

const Organizations = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  const {
    data,
    isLoading,
    pagination,
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
  } = useDataTable<Organization>({
    fetchData: organizationService.getOrganizations,
    defaultSortKey: "name",
    defaultSortDirection: "asc",
  })

  const handleOpenDialog = (organization: Organization | null = null) => {
    setSelectedOrganization(organization)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedOrganization(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: OrganizationCreate | OrganizationUpdate) => {
    try {
      if (selectedOrganization) {
        await organizationService.updateOrganization(selectedOrganization.id, formData as OrganizationUpdate)
      } else {
        await organizationService.createOrganization(formData as OrganizationCreate)
      }
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'organisation:", error)
    }
  }

  const handleDelete = async (organization: Organization) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette organisation ?")) {
      try {
        await organizationService.deleteOrganization(organization.id)
        refresh()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns = [
    { key: "name", header: "Nom", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "phone", header: "Téléphone", sortable: false },
    { key: "timezone", header: "Fuseau horaire", sortable: true },
    { key: "plan", header: "Plan", sortable: true },
    { key: "is_active", header: "Statut", sortable: false },
    { key: "sites_count", header: "Sites", sortable: true },
    { key: "employees_count", header: "Employés", sortable: true },
    { key: "users_count", header: "Utilisateurs", sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des organisations</h1>
          <p className="text-accent">Gérez les organisations et leurs informations</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle organisation</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map(o => ({...o, is_active: o.is_active ? "Active" : "Inactive"})) as unknown as Organization[]}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        sortConfig={sortConfig}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <OrganizationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        organization={selectedOrganization}
      />
    </div>
  )
}

export default Organizations