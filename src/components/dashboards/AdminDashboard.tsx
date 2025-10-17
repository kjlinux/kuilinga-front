"use client"

import { useEffect, useState } from "react"
import type { AdminDashboard as AdminDashboardType } from "../../types"
import dashboardService from "../../services/dashboard.service"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getAdminDashboard()
        if (response) {
          setData(response)
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Chargement des données du tableau de bord administrateur...</div>
  }

  if (!data) {
    return (
      <div>
        Impossible de charger les données du tableau de bord administrateur.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Tableau de Bord Administrateur Système
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-bold">Organisations Actives</h3>
          <p className="text-3xl">{data.active_organizations}</p>
        </div>
        <div className="card">
          <h3 className="font-bold">Pointages du Jour</h3>
          <p className="text-3xl">{data.daily_attendance_count}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-96">
          <h3 className="font-bold mb-4">Utilisateurs par Organisation</h3>
          <ResponsiveContainer>
            <BarChart data={data.users_per_organization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="user_count" fill="#8884d8" name="Utilisateurs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96">
          <h3 className="font-bold mb-4">Sites par Organisation</h3>
          <ResponsiveContainer>
            <BarChart data={data.sites_per_organization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="site_count" fill="#82ca9d" name="Sites" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96">
          <h3 className="font-bold mb-4">Répartition des Plans</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.plan_distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="plan"
                label
              >
                {data.plan_distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96">
          <h3 className="font-bold mb-4">Statut des Dispositifs</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.device_status_ratio}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
                label
              >
                {data.device_status_ratio.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96 col-span-1 lg:col-span-2">
          <h3 className="font-bold mb-4">
            Top 10 Organisations par Employés
          </h3>
          <ResponsiveContainer>
            <BarChart data={data.top_10_organizations_by_employees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="employee_count"
                fill="#ffc658"
                name="Nombre d'employés"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard