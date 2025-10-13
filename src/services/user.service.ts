import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Employee, PaginatedResponse, Filter } from "../types"

class UserService {
  async getEmployees(page = 1, limit = 20, filters?: Filter): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    if (filters?.search) params.append("search", filters.search)
    if (filters?.departement) params.append("departement", filters.departement)
    if (filters?.statut) params.append("statut", filters.statut)

    const url = `${API_CONFIG.ENDPOINTS.EMPLOYEES}?${params.toString()}`
    return apiService.get<PaginatedResponse<Employee>>(url)
  }

  async getEmployee(id: string): Promise<Employee> {
    return apiService.get<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`)
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return apiService.post<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES, data)
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return apiService.put<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`, data)
  }

  async deleteEmployee(id: string): Promise<void> {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`)
  }

  async importEmployees(file: File): Promise<unknown> {
    const formData = new FormData()
    formData.append("file", file)

    return apiService.post(API_CONFIG.ENDPOINTS.EMPLOYEE_IMPORT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }
}

export default new UserService()
