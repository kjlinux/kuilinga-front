"use "

import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import type { Notification } from "../types"
import notificationService from "../services/notification.service"
import { NotificationContext } from "./definitions/NotificationContext"

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, lu: true } : notif)))
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, lu: true })))
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.lu).length

  useEffect(() => {
    fetchNotifications()
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
