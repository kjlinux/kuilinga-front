import apiService from "./api.service";
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
    return apiService.get<PaginatedResponse<Department>>(url);
  }

  async getDepartment(id: string): Promise<Department> {
    return apiService.get<Department>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);
  }

  async createDepartment(data: DepartmentCreate): Promise<Department> {
    return apiService.post<Department>(API_CONFIG.ENDPOINTS.DEPARTMENTS, data);
  }

  async updateDepartment(id: string, data: DepartmentUpdate): Promise<Department> {
    return apiService.put<Department>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`, data);
  }

  async deleteDepartment(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.DEPARTMENTS}/${id}`);
  }
}

export default new DepartmentService();