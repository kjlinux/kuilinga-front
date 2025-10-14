import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Leave, PaginatedResponse, Filter } from "../types"

class LeaveService {
  async getLeaves(page = 1, limit = 10, filters?: Filter): Promise<PaginatedResponse<Leave>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_CONFIG.ENDPOINTS.LEAVES}?${params.toString()}`
    return apiService.get<PaginatedResponse<Leave>>(url)
  }

  async getLeave(id: string): Promise<Leave> {
    return apiService.get<Leave>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`)
  }

  async createLeave(data: Partial<Leave>): Promise<Leave> {
    return apiService.post<Leave>(API_CONFIG.ENDPOINTS.LEAVES, data)
  }

  async updateLeave(id: string, data: Partial<Leave>): Promise<Leave> {
    return apiService.put<Leave>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`, data)
  }

  async deleteLeave(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`)
  }
}

export default new LeaveService()
