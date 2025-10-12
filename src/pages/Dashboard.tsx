"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, UserCheck, UserX, Clock, TrendingUp } from "lucide-react"
import StatCard from "../components/StatCard"
import LoadingSpinner from "../components/LoadingSpinner"
import attendanceService from "../services/attendance.service"
import type { AttendanceStats } from "../types"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const Dashboard = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await attendanceService.getStats()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Données pour les graphiques (exemple)
  const trendData = [
    { jour: "Lun", presents: 85, absents: 15 },
    { jour: "Mar", presents: 88, absents: 12 },
    { jour: "Mer", presents: 82, absents: 18 },
    { jour: "Jeu", presents: 90, absents: 10 },
    { jour: "Ven", presents: 87, absents: 13 },
  ]

  const pieData = [
    { name: "Présents", value: stats?.presents || 0, color: "#10b981" },
    { name: "Absents", value: stats?.absents || 0, color: "#ef4444" },
    { name: "Retards", value: stats?.retards || 0, color: "#f59e0b" },
  ]

  const departmentData = [
    { name: "IT", taux: 95 },
    { name: "RH", taux: 88 },
    { name: "Finance", taux: 92 },
    { name: "Marketing", taux: 85 },
    { name: "Ventes", taux: 90 },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Tableau de bord</h1>
        <p className="text-accent">Vue d'ensemble des présences en temps réel</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Présents aujourd'hui"
          value={stats?.presents || 0}
          icon={UserCheck}
          color="success"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Absents"
          value={stats?.absents || 0}
          icon={UserX}
          color="danger"
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard title="Retards" value={stats?.retards || 0} icon={Clock} color="warning" />
        <StatCard
          title="Taux de présence"
          value={`${stats?.taux_presence || 0}%`}
          icon={TrendingUp}
          color="primary"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des présences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-xl font-semibold text-secondary mb-4">Évolution de la semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CECECE" />
              <XAxis dataKey="jour" stroke="#A6A6A8" />
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
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Répartition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary mb-4">Répartition aujourd'hui</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Taux par département */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-semibold text-secondary mb-4">Taux de présence par département</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CECECE" />
              <XAxis dataKey="name" stroke="#A6A6A8" />
              <YAxis stroke="#A6A6A8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #CECECE",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="taux" fill="#703D57" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-secondary mb-4">Activité récente</h2>
        <div className="space-y-3">
          {[
            { nom: "Jean Dupont", action: "Arrivée", heure: "08:15", statut: "success" },
            { nom: "Marie Martin", action: "Arrivée", heure: "08:45", statut: "warning" },
            { nom: "Pierre Durand", action: "Départ", heure: "17:30", statut: "info" },
            { nom: "Sophie Bernard", action: "Arrivée", heure: "09:10", statut: "warning" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-secondary">{activity.nom}</p>
                  <p className="text-sm text-accent">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary">{activity.heure}</p>
                <span
                  className={`badge ${
                    activity.statut === "success"
                      ? "badge-success"
                      : activity.statut === "warning"
                        ? "badge-warning"
                        : "badge-info"
                  }`}
                >
                  {activity.statut === "success" ? "À l'heure" : activity.statut === "warning" ? "En retard" : "Départ"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
