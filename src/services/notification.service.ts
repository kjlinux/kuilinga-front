import { apiService } from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Notification } from "../types"

// NOTE: Notification endpoints are NOT implemented in the current API specification.
// All methods in this service gracefully handle missing endpoints by returning empty results
// or logging warnings. This allows the UI to function without breaking when notifications are unavailable.

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      // Check if notifications endpoint exists
      const response = await apiService.get<Notification[]>(API_CONFIG.ENDPOINTS.NOTIFICATIONS)
      return Array.isArray(response.data) ? response.data : []
    } catch (error: unknown) {
      // If endpoint doesn't exist (404) or any other error, return empty array
      console.warn("Notifications endpoint not available, returning empty array:", (error as { response?: { status?: number } })?.response?.status)
      return []
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}/read`)
    } catch (error: unknown) {
      console.warn("Could not mark notification as read:", error)
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/read-all`)
    } catch (error: unknown) {
      console.warn("Could not mark all notifications as read:", error)
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await apiService.delete(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`)
    } catch (error: unknown) {
      console.warn("Could not delete notification:", error)
    }
  }
}

export default new NotificationService()
