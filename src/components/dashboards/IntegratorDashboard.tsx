"use client"

import { useEffect, useState } from "react"
import type { IntegratorDashboard as IntegratorDashboardType } from "../../types"
import dashboardService from "../../services/dashboard.service"
import { useAuth } from "../../hooks/useAuth"
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

const COLORS = ["#00C49F", "#FF8042", "#FFBB28"]

const IntegratorDashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState<IntegratorDashboardType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Replace with dynamic organization ID from user context
      const organizationId = user?.organization_id ?? "your-default-org-id"

      if (!organizationId) {
        setLoading(false)
        console.error("Organization ID is missing.")
        return
      }

      try {
        const response =
          await dashboardService.getIntegratorDashboard(organizationId)
        if (response) {
          setData(response)
        }
      } catch (error) {
        console.error("Failed to fetch integrator dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading) {
    return <div>Chargement des données du tableau de bord intégrateur...</div>
  }

  if (!data) {
    return (
      <div>
        Impossible de charger les données du tableau de bord intégrateur.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Tableau de Bord Intégrateur / Technicien IoT
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="card h-96">
          <h3 className="font-bold mb-4">Pointages par Dispositif</h3>
          <ResponsiveContainer>
            <BarChart data={data.attendance_per_device}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="serial_number" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="attendance_count"
                fill="#82ca9d"
                name="Nombre de pointages"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default IntegratorDashboard