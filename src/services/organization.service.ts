import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Organization, PaginatedResponse, Filter } from "../types"

class OrganizationService {
  async getOrganizations(page = 1, limit = 10, filters?: Filter): Promise<PaginatedResponse<Organization>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}?${params.toString()}`
    return apiService.get<PaginatedResponse<Organization>>(url)
  }

  async getOrganization(id: string): Promise<Organization> {
    return apiService.get<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  }

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    return apiService.post<Organization>(API_CONFIG.ENDPOINTS.ORGANIZATIONS, data)
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    return apiService.put<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`, data)
  }

  async deleteOrganization(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`)
  }
}

export default new OrganizationService()
