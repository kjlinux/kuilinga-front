import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Notification } from "../types"

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    return apiService.get<Notification[]>(API_CONFIG.ENDPOINTS.NOTIFICATIONS)
  }

  async markAsRead(id: string): Promise<void> {
    return apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}/read`)
  }

  async markAllAsRead(): Promise<void> {
    return apiService.put(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/read-all`)
  }

  async deleteNotification(id: string): Promise<void> {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`)
  }
}

export default new NotificationService()
