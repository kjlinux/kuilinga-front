"use client"

import { useEffect, useState } from "react"
import type { ManagerDashboard as ManagerDashboardType } from "../../types"
import dashboardService from "../../services/dashboard.service"
import { useAuth } from "../../hooks/useAuth"
import {
  LineChart,
  Line,
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

const COLORS = ["#0088FE", "#FF8042", "#FFBB28"]

const ManagerDashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState<ManagerDashboardType | null>(null)
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
        const response = await dashboardService.getManagerDashboard(organizationId)
        if (response) {
          setData(response)
        }
      } catch (error) {
        console.error("Failed to fetch manager dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading) {
    return <div>Chargement des données du tableau de bord manager...</div>
  }

  if (!data) {
    return (
      <div>Impossible de charger les données du tableau de bord manager.</div>
    )
  }

  const patData = [
    {
      name: "Présents",
      value: data.presence_absence_tardiness_distribution.present,
    },
    {
      name: "Absents",
      value: data.presence_absence_tardiness_distribution.absent,
    },
    { name: "Retards", value: data.presence_absence_tardiness_distribution.tardy },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Tableau de Bord Manager / RH
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card text-center">
          <h3 className="font-bold">Présents</h3>
          <p className="text-3xl">{data.present_today}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Absents</h3>
          <p className="text-3xl">{data.absent_today}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Retards</h3>
          <p className="text-3xl">{data.tardy_today}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Taux de Présence</h3>
          <p className="text-3xl">{(data.attendance_rate * 100).toFixed(1)}%</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Heures Travaillées</h3>
          <p className="text-3xl">{data.total_work_hours.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-bold">Congés en Attente</h3>
          <p className="text-3xl">{data.pending_leaves}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card h-96 lg:col-span-2">
          <h3 className="font-bold mb-4">Évolution des Présences (30j)</h3>
          <ResponsiveContainer>
            <LineChart data={data.presence_evolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="presence_count"
                stroke="#8884d8"
                name="Nombre de présents"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card h-96">
          <h3 className="font-bold mb-4">
            Distribution Présents/Absents/Retards
          </h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={patData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {patData.map((entry, index) => (
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
      </div>

      {/* Real-time Attendances Table */}
      <div className="card">
        <h3 className="font-bold mb-4">Pointages en Temps Réel</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Employé</th>
                <th className="p-2">Heure</th>
                <th className="p-2">Type</th>
                <th className="p-2">Dispositif</th>
              </tr>
            </thead>
            <tbody>
              {data.real_time_attendances.map((att) => (
                <tr key={att.id} className="border-b">
                  <td className="p-2">{att.employee?.full_name ?? "N/A"}</td>
                  <td className="p-2">
                    {new Date(att.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-2">{att.type}</td>
                  <td className="p-2">{att.device?.serial_number ?? "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard