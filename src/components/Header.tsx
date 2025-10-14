"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, Bell, User, LogOut, SettingsIcon } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useNotification } from "../hooks/useNotification"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead } = useNotification()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo et menu burger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-secondary" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-primary">KUILINGA</span>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-secondary">Notifications</h3>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-accent">Aucune notification</div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.lu ? "bg-blue-50" : ""
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notif.type === "error"
                                  ? "bg-red-500"
                                  : notif.type === "warning"
                                    ? "bg-yellow-500"
                                    : notif.type === "success"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-secondary">{notif.titre}</p>
                              <p className="text-xs text-accent mt-1">{notif.message}</p>
                              <p className="text-xs text-accent mt-1">
                                {new Date(notif.timestamp).toLocaleString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <Link
                        to="/notifications"
                        className="text-sm text-primary hover:underline block text-center"
                        onClick={() => setShowNotifications(false)}
                      >
                        Voir toutes les notifications
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profil utilisateur */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user?.photo ? (
                <img
                  src={user.photo || "/placeholder.svg"}
                  alt={`${user.prenom} ${user.nom}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-accent capitalize">{user?.role}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-secondary">
                      {user?.prenom} {user?.nom}
                    </p>
                    <p className="text-sm text-accent">{user?.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <SettingsIcon className="w-5 h-5 text-accent" />
                      <span className="text-sm text-secondary">Paramètres</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
