import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Device, PaginatedResponse, PaginationParams, DeviceCreate, DeviceUpdate } from "../types";

class DeviceService {
  async getDevices(params: PaginationParams = {}): Promise<PaginatedResponse<Device>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.DEVICES}?${query}`;
    return apiService.get<PaginatedResponse<Device>>(url);
  }

  async getDevice(id: string): Promise<Device> {
    return apiService.get<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`);
  }

  async createDevice(data: DeviceCreate): Promise<Device> {
    return apiService.post<Device>(API_CONFIG.ENDPOINTS.DEVICES, data);
  }

  async updateDevice(id: string, data: DeviceUpdate): Promise<Device> {
    return apiService.put<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`, data);
  }

  async deleteDevice(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`);
  }
}

export default new DeviceService();