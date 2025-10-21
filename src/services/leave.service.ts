import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Leave, PaginatedResponse, PaginationParams, LeaveCreate, LeaveUpdate } from "../types";

class LeaveService {
  async getLeaves(params: PaginationParams = {}): Promise<PaginatedResponse<Leave>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.LEAVES}?${query}`;
    const response = await apiService.get<PaginatedResponse<Leave>>(url);
    return response.data;
  }

  async getLeave(id: string): Promise<Leave> {
    const response = await apiService.get<Leave>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`);
    return response.data;
  }

  async createLeave(data: LeaveCreate): Promise<Leave> {
    const response = await apiService.post<Leave>(API_CONFIG.ENDPOINTS.LEAVES, data);
    return response.data;
  }

  async updateLeave(id: string, data: LeaveUpdate): Promise<Leave> {
    const response = await apiService.put<Leave>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`, data);
    return response.data;
  }

  async deleteLeave(id: string): Promise<void> {
    await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`);
  }
}

export default new LeaveService();