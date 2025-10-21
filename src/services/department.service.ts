import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Department, PaginatedResponse, PaginationParams, DepartmentCreate, DepartmentUpdate } from "../types";

class DepartmentService {
  async getDepartments(params: PaginationParams = {}): Promise<PaginatedResponse<Department>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.DEPARTMENTS}?${query}`;
    const response = await apiService.get<PaginatedResponse<Department>>(url);
    return response.data;
  }

  async getDepartment(id: string): Promise<Department> {
    const response = await apiService.get<Department>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);
    return response.data;
  }

  async createDepartment(data: DepartmentCreate): Promise<Department> {
    const response = await apiService.post<Department>(API_CONFIG.ENDPOINTS.DEPARTMENTS, data);
    return response.data;
  }

  async updateDepartment(id: string, data: DepartmentUpdate): Promise<Department> {
    const response = await apiService.put<Department>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, data);
    return response.data;
  }

  async deleteDepartment(id: string): Promise<void> {
    await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);
  }
}

export default new DepartmentService();