import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Employee, PaginatedResponse, PaginationParams, EmployeeCreate, EmployeeUpdate } from "../types";

class EmployeeService {
  async getEmployees(params: PaginationParams = {}): Promise<PaginatedResponse<Employee>> {
    // NOTE: API only supports 'skip', 'limit', and 'organization_id' parameters.
    // 'search', 'sort_by', 'sort_order' are NOT supported by the backend API.
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 20).toString(),
        // organization_id can be added when filtering by organization
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.EMPLOYEES}?${query}`;
    const response = await apiService.get<PaginatedResponse<Employee>>(url);
    return response.data;
  }

  // NOTE: The following methods are NOT supported by the API as of the current API specification.
  // The API only provides GET /api/v1/employees/ (list) and POST /api/v1/employees/ (create).
  // Individual employee operations (GET/PUT/DELETE by ID) are not implemented in the backend.
  // These methods will fail with 404 errors until the backend implements these endpoints.

  async getEmployee(id: string): Promise<Employee> {
    // TODO: Backend must implement GET /api/v1/employees/{employee_id}
    const response = await apiService.get<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}${id}`);
    return response.data;
  }

  async createEmployee(data: EmployeeCreate): Promise<Employee> {
    const response = await apiService.post<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES, data);
    return response.data;
  }

  async updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee> {
    // TODO: Backend must implement PUT /api/v1/employees/{employee_id}
    const response = await apiService.put<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}${id}`, data);
    return response.data;
  }

  async deleteEmployee(id: string): Promise<void> {
    // TODO: Backend must implement DELETE /api/v1/employees/{employee_id}
    await apiService.delete(`${API_CONFIG.ENDPOINTS.EMPLOYEES}${id}`);
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