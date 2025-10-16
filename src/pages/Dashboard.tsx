"use client"

import { useAuth } from "../hooks/useAuth"
import { motion } from "framer-motion"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Tableau de bord</h1>
        <p className="text-accent">Vue d'ensemble des présences en temps réel</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          Bienvenue, {user?.full_name}!
        </h2>
        <p className="text-accent">
          Utilisez le menu de gauche pour naviguer dans l'application.
        </p>
      </motion.div>
    </div>
  )
}

export default Dashboard