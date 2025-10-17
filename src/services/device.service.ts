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
    const response = await apiService.get<PaginatedResponse<Device>>(url);
    return response.data;
  }

  async getDevice(id: string): Promise<Device> {
    const response = await apiService.get<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`);
    return response.data;
  }

  async createDevice(data: DeviceCreate): Promise<Device> {
    const response = await apiService.post<Device>(API_CONFIG.ENDPOINTS.DEVICES, data);
    return response.data;
  }

  async updateDevice(id: string, data: DeviceUpdate): Promise<Device> {
    const response = await apiService.put<Device>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`, data);
    return response.data;
  }

  async deleteDevice(id: string): Promise<void> {
    await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEVICES}/${id}`);
  }
}

export default new DeviceService();