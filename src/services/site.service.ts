import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Site, PaginatedResponse, Filter } from "../types"

class SiteService {
  async getSites(page = 1, limit = 10, filters?: Filter): Promise<PaginatedResponse<Site>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_CONFIG.ENDPOINTS.SITES}?${params.toString()}`
    return apiService.get<PaginatedResponse<Site>>(url)
  }

  async getSite(id: string): Promise<Site> {
    return apiService.get<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`)
  }

  async createSite(data: Partial<Site>): Promise<Site> {
    return apiService.post<Site>(API_CONFIG.ENDPOINTS.SITES, data)
  }

  async updateSite(id: string, data: Partial<Site>): Promise<Site> {
    return apiService.put<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`, data)
  }

  async deleteSite(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`)
  }
}

export default new SiteService()
