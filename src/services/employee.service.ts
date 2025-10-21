import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Employee, PaginatedResponse, PaginationParams, EmployeeCreate, EmployeeUpdate } from "../types";

class EmployeeService {
  async getEmployees(params: PaginationParams = {}): Promise<PaginatedResponse<Employee>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 20).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.EMPLOYEES}?${query}`;
    const response = await apiService.get<PaginatedResponse<Employee>>(url);
    return response.data;
  }

  async getEmployee(id: string): Promise<Employee> {
    const response = await apiService.get<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`);
    return response.data;
  }

  async createEmployee(data: EmployeeCreate): Promise<Employee> {
    const response = await apiService.post<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES, data);
    return response.data;
  }

  async updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee> {
    const response = await apiService.put<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`, data);
    return response.data;
  }

  async deleteEmployee(id: string): Promise<void> {
    await apiService.delete(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`);
  }

  async importEmployees(file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post(API_CONFIG.ENDPOINTS.EMPLOYEE_IMPORT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export default new EmployeeService();