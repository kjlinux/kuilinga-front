import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Department, PaginatedResponse, Filter } from "../types"

class DepartmentService {
  async getDepartments(page = 1, limit = 10, filters?: Filter): Promise<PaginatedResponse<Department>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_CONFIG.ENDPOINTS.DEPARTMENTS}?${params.toString()}`
    return apiService.get<PaginatedResponse<Department>>(url)
  }

  async getDepartment(id: string): Promise<Department> {
    return apiService.get<Department>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`)
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    return apiService.post<Department>(API_CONFIG.ENDPOINTS.DEPARTMENTS, data)
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return apiService.put<Department>(`${API__CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, data)
  }

  async deleteDepartment(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`)
  }
}

export default new DepartmentService()
