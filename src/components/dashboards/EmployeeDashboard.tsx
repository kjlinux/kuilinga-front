"use client"

import { useEffect, useState } from "react"
import type { EmployeeDashboard as EmployeeDashboardType } from "../../types"
import dashboardService from "../../services/dashboard.service"
import { useAuth } from "../../hooks/useAuth"
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#00C49F", "#FFBB28"]

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState<EmployeeDashboardType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Replace with dynamic employee ID from user context or another source
      const employeeId = "your-default-employee-id"

      if (!employeeId) {
        setLoading(false)
        console.error("Employee ID is missing.")
        return
      }

      try {
        const response = await dashboardService.getEmployeeDashboard(employeeId)
        if (response) {
          setData(response)
        }
      } catch (error) {
        console.error("Failed to fetch employee dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading) {
    return <div>Chargement de votre tableau de bord...</div>
  }

  if (!data) {
    return <div>Impossible de charger votre tableau de bord.</div>
  }

  const leaveData = [
    { name: "Utilisés", value: data.leave_balance.used },
    { name: "Disponibles", value: data.leave_balance.available },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Mon Tableau de Bord</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold">Mon Taux de Présence (Mois)</h3>
          <p className="text-3xl">
            {(data.monthly_attendance_rate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="card">
          <h3 className="font-bold">Solde de Congés (Total)</h3>
          <p className="text-3xl">{data.leave_balance.total} jours</p>
        </div>
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-96">
          <h3 className="font-bold mb-4">Répartition des Congés</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label
              >
                {leaveData.map((entry, index) => (
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

        <div className="card">
          <h3 className="font-bold mb-4">Mes Pointages Aujourd'hui</h3>
          {data.today_attendances.length > 0 ? (
            <ul className="space-y-2">
              {data.today_attendances.map((att) => (
                <li
                  key={att.id}
                  className="flex justify-between items-center p-2 bg-background rounded"
                >
                  <span>
                    {att.type === "in" ? "Entrée" : "Sortie"}
                  </span>
                  <span className="font-mono">
                    {new Date(att.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun pointage pour aujourd'hui.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard