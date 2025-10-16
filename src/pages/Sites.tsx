"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import DataTable from "../components/DataTable"
import useDataTable from "../hooks/useDataTable"
import siteService from "../services/site.service"
import type { Site, SiteCreate, SiteUpdate } from "../types"
import SiteDialog from "../components/SiteDialog"

const Sites = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  const {
    data,
    isLoading,
    pagination,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataTable<Site>({
    fetchData: siteService.getSites,
  })

  const handleOpenDialog = (site: Site | null = null) => {
    setSelectedSite(site)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setSelectedSite(null)
    setIsDialogOpen(false)
  }

  const handleConfirm = async (formData: SiteCreate | SiteUpdate) => {
    try {
      if (selectedSite) {
        await siteService.updateSite(selectedSite.id, formData as SiteUpdate)
      } else {
        await siteService.createSite(formData as SiteCreate)
      }
      refresh()
      handleCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du site:", error)
    }
  }

  const handleDelete = async (site: Site) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      try {
        await siteService.deleteSite(site.id)
        refresh()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const columns = [
    { key: "name", header: "Nom" },
    { key: "address", header: "Adresse" },
    { key: "organization", header: "Organisation" },
    { key: "timezone", header: "Fuseau horaire" },
    { key: "departments_count", header: "Départements" },
    { key: "employees_count", header: "Employés" },
    { key: "devices_count", header: "Terminaux" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Gestion des sites</h1>
          <p className="text-accent">Gérez les sites de vos organisations</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau site</span>
          </button>
        </div>
      </div>

      <DataTable
        data={data.map(s => ({...s, organization: s.organization?.name}))}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <SiteDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        site={selectedSite}
      />
    </div>
  )
}

export default Sites