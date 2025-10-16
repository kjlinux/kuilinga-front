"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import type { ReportRequest, AttendanceReport, ReportPeriod } from "../types"
import reportService from "../services/report.service"
import LoadingSpinner from "../components/LoadingSpinner"

const Reports = () => {
  const [filters, setFilters] = useState<Partial<ReportRequest>>({
    period: "monthly",
    start_date: "",
    end_date: "",
    organization_id: 0,
    format: "pdf"
  })
  const [reportData, setReportData] = useState<AttendanceReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = async () => {
    if (!filters.organization_id || !filters.period || !filters.start_date || !filters.end_date) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      setIsGenerating(true)
      const data = await reportService.generateAttendanceReport(filters as ReportRequest)
      setReportData(data)
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Rapports et Analyses</h1>
        <p className="text-accent">Visualisez et exportez vos rapports de présence</p>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">ID Organisation</label>
            <input
              type="number"
              value={filters.organization_id}
              onChange={(e) => setFilters({ ...filters, organization_id: parseInt(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Période</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value as ReportPeriod })}
              className="input"
            >
              <option value="daily">Aujourd'hui</option>
              <option value="weekly">Cette semaine</option>
              <option value="monthly">Ce mois</option>
              <option value="custom">Personnalisé</option>
            </select>
          </div>

          {filters.period === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date début</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date fin</label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                  className="input"
                />
              </div>
            </>
          )}

          <div className="flex items-end gap-2">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? "Génération..." : "Générer"}
            </button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center min-h-[30vh]">
          <LoadingSpinner size="large" />
        </div>
      )}

      {reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Rapport de présence
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><strong>Organisation:</strong> {reportData.organization_name}</div>
            <div><strong>Période:</strong> {reportData.period}</div>
            <div><strong>Date de début:</strong> {reportData.start_date}</div>
            <div><strong>Date de fin:</strong> {reportData.end_date}</div>
            <div><strong>Total des employés:</strong> {reportData.total_employees}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Employé</th>
                  <th className="table-header-cell">Badge</th>
                  <th className="table-header-cell">Département</th>
                  <th className="table-header-cell">Jours totaux</th>
                  <th className="table-header-cell">Jours présents</th>
                  <th className="table-header-cell">Jours absents</th>
                  <th className="table-header-cell">Jours en retard</th>
                  <th className="table-header-cell">Jours en congé</th>
                  <th className="table-header-cell">Taux de présence</th>
                  <th className="table-header-cell">Heures totales</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {reportData.rows.map((row) => (
                  <tr key={row.employee_id}>
                    <td className="table-cell">{row.employee_name}</td>
                    <td className="table-cell">{row.badge_id}</td>
                    <td className="table-cell">{row.department}</td>
                    <td className="table-cell">{row.total_days}</td>
                    <td className="table-cell">{row.present_days}</td>
                    <td className="table-cell">{row.absent_days}</td>
                    <td className="table-cell">{row.late_days}</td>
                    <td className="table-cell">{row.on_leave_days}</td>
                    <td className="table-cell">{row.attendance_rate}%</td>
                    <td className="table-cell">{row.total_hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Reports