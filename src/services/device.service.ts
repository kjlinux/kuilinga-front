import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Device, PaginatedResponse, Filter } from "../types"

class DeviceService {
  async getDevices(page = 1, limit = 10, filters?: Filter): Promise<PaginatedResponse<Device>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())
    if (filters?.search) params.append("search", filters.search)

    const url = `${API_CONFIG.ENDPOINTS.DEVICES}?${params.toString()}`
    return apiService.get<PaginatedResponse<Device>>(url)
  }

  async getDevice(id: string): Promise<Device> {
    return apiService.get<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`)
  }

  async createDevice(data: Partial<Device>): Promise<Device> {
    return apiService.post<Device>(API_CONFIG.ENDPOINTS.DEVICES, data)
  }

  async updateDevice(id: string, data: Partial<Device>): Promise<Device> {
    return apiService.put<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`, data)
  }

  async deleteDevice(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`)
  }
}

export default new DeviceService()
