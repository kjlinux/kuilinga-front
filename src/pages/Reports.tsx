"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, TrendingUp, Clock, Users } from "lucide-react"
import type { ReportFilter } from "../types"
import reportService from "../services/report.service"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const Reports = () => {
  const [filters, setFilters] = useState<ReportFilter>({
    periode: "mois",
    date_debut: "",
    date_fin: "",
  })
  const [reportData, setReportData] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const generateReport = async () => {
    try {
      setIsGenerating(true)
      const data = await reportService.generateReport("presence", filters)
      setReportData(data)
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    try {
      setIsExporting(true)
      const blob = await reportService.exportReport("presence", filters, format)
      const filename = `rapport_presence_${new Date().toISOString().split("T")[0]}.${format}`
      reportService.downloadFile(blob, filename)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Données exemple pour les graphiques
  const monthlyData = [
    { mois: "Jan", presents: 920, absents: 80, retards: 45 },
    { mois: "Fév", presents: 950, absents: 50, retards: 38 },
    { mois: "Mar", presents: 980, absents: 20, retards: 42 },
    { mois: "Avr", presents: 960, absents: 40, retards: 35 },
    { mois: "Mai", presents: 990, absents: 10, retards: 28 },
    { mois: "Juin", presents: 970, absents: 30, retards: 32 },
  ]

  const topEmployees = [
    { nom: "Jean Dupont", taux: 98, heures: 176 },
    { nom: "Marie Martin", taux: 97, heures: 174 },
    { nom: "Pierre Durand", taux: 96, heures: 172 },
    { nom: "Sophie Bernard", taux: 95, heures: 170 },
    { nom: "Luc Petit", taux: 94, heures: 168 },
  ]

  const delayStats = [
    { departement: "IT", retards: 12 },
    { departement: "RH", retards: 8 },
    { departement: "Finance", retards: 15 },
    { departement: "Marketing", retards: 10 },
    { departement: "Ventes", retards: 18 },
  ]

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
            <label className="block text-sm font-medium text-secondary mb-2">Période</label>
            <select
              value={filters.periode}
              onChange={(e) => setFilters({ ...filters, periode: e.target.value as ReportFilter["periode"] })}
              className="input"
            >
              <option value="jour">Aujourd'hui</option>
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="annee">Cette année</option>
              <option value="personnalise">Personnalisé</option>
            </select>
          </div>

          {filters.periode === "personnalise" && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date début</label>
                <input
                  type="date"
                  value={filters.date_debut}
                  onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date fin</label>
                <input
                  type="date"
                  value={filters.date_fin}
                  onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                  className="input"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Département</label>
            <select
              value={filters.departement}
              onChange={(e) => setFilters({ ...filters, departement: e.target.value })}
              className="input"
            >
              <option value="">Tous</option>
              {/* TODO: Remplir dynamiquement */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Site</label>
            <select
              value={filters.site}
              onChange={(e) => setFilters({ ...filters, site: e.target.value })}
              className="input"
            >
              <option value="">Tous</option>
              {/* TODO: Remplir dynamiquement */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Classe</label>
            <input
              type="text"
              placeholder="Ex: 6ème"
              value={filters.classe}
              onChange={(e) => setFilters({ ...filters, classe: e.target.value })}
              className="input"
            />
          </div>

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

      {/* Boutons d'export */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleExport("csv")}
          disabled={isExporting}
          className="btn-outline flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={() => handleExport("xlsx")}
          disabled={isExporting}
          className="btn-outline flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
        <button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          className="btn-outline flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Évolution mensuelle
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData?.monthlyData || monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CECECE" />
              <XAxis dataKey="mois" stroke="#A6A6A8" />
              <YAxis stroke="#A6A6A8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #CECECE",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="presents" stroke="#10b981" strokeWidth={2} name="Présents" />
              <Line type="monotone" dataKey="absents" stroke="#ef4444" strokeWidth={2} name="Absents" />
              <Line type="monotone" dataKey="retards" stroke="#f59e0b" strokeWidth={2} name="Retards" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Retards par département */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Retards par département
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData?.delayStats || delayStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CECECE" />
              <XAxis dataKey="departement" stroke="#A6A6A8" />
              <YAxis stroke="#A6A6A8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #CECECE",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="retards" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top employés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Top 5 - Meilleure assiduité
        </h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Rang</th>
                <th className="table-header-cell">Nom</th>
                <th className="table-header-cell">Taux de présence</th>
                <th className="table-header-cell">Heures travaillées</th>
                <th className="table-header-cell">Performance</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {(reportData?.topEmployees || topEmployees).map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="table-cell font-medium">{employee.nom}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${employee.taux}%` }} />
                      </div>
                      <span className="text-sm font-medium">{employee.taux}%</span>
                    </div>
                  </td>
                  <td className="table-cell">{employee.heures}h</td>
                  <td className="table-cell">
                    <span className="badge-success">Excellent</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports
