import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Notification } from "../types"

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      // Check if notifications endpoint exists
      const response = await apiService.get<Notification[]>(API_CONFIG.ENDPOINTS.NOTIFICATIONS)
      return Array.isArray(response) ? response : []
    } catch (error: unknown) {
      // If endpoint doesn't exist (404) or any other error, return empty array
      console.warn("Notifications endpoint not available, returning empty array:", (error as { response?: { status?: number } })?.response?.status)
      return []
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      return apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}/read`)
    } catch (error) {
      console.warn("Could not mark notification as read:", error)
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      return apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/read-all`)
    } catch (error) {
      console.warn("Could not mark all notifications as read:", error)
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      return apiService.delete(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`)
    } catch (error) {
      console.warn("Could not delete notification:", error)
    }
  }
}

export default new NotificationService()