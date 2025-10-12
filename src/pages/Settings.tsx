"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, User, Bell, Lock, Globe } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Lock },
    { id: "preferences", label: "Préférences", icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Paramètres</h1>
        <p className="text-accent">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu des onglets */}
        <div className="lg:col-span-1">
          <div className="card space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id ? "bg-primary text-white" : "text-secondary hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Informations du profil</h2>

                <div className="flex items-center gap-4">
                  {user?.photo ? (
                    <img
                      src={user.photo || "/placeholder.svg"}
                      alt="Photo de profil"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <button className="btn-outline">Changer la photo</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Prénom</label>
                    <input type="text" defaultValue={user?.prenom} className="input" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Nom</label>
                    <input type="text" defaultValue={user?.nom} className="input" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                    <input type="email" defaultValue={user?.email} className="input" />
                  </div>
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Préférences de notification</h2>

                <div className="space-y-4">
                  {[
                    { label: "Notifications par email", description: "Recevoir des notifications par email" },
                    { label: "Notifications push", description: "Recevoir des notifications dans le navigateur" },
                    { label: "Alertes de retard", description: "Être notifié en cas de retard" },
                    { label: "Rapports hebdomadaires", description: "Recevoir un résumé hebdomadaire" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary">{item.label}</p>
                        <p className="text-sm text-accent">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer les préférences
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Sécurité du compte</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Mot de passe actuel</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Nouveau mot de passe</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Confirmer le mot de passe</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Changer le mot de passe
                </button>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Préférences générales</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Langue</label>
                    <select className="input">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Fuseau horaire</label>
                    <select className="input">
                      <option value="Africa/Kinshasa">Africa/Kinshasa (GMT+1)</option>
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Format de date</label>
                    <select className="input">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Thème</label>
                    <select className="input">
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer les préférences
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
