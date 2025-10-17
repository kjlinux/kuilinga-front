import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import { Organization, Site, Department, Employee, PaginatedResponse } from "../types";

class FilterService {
  async getOrganizations(): Promise<Organization[]> {
    const response = await apiService.get<PaginatedResponse<Organization>>(API_CONFIG.ENDPOINTS.ORGANIZATIONS);
    return response.data.items;
  }

  async getSites(organizationId: string): Promise<Site[]> {
    // The API does not support filtering sites by organization, so we fetch all and filter client-side.
    // This is not ideal, but it's a workaround until the API is updated.
    const response = await apiService.get<PaginatedResponse<Site>>(API_CONFIG.ENDPOINTS.SITES);
    return response.data.items.filter(site => site.organization?.id === organizationId);
  }

  async getDepartments(siteId: string): Promise<Department[]> {
    // The API does not support filtering departments by site, so we fetch all and filter client-side.
    const response = await apiService.get<PaginatedResponse<Department>>(API_CONFIG.ENDPOINTS.DEPARTMENTS);
    return response.data.items.filter(dept => dept.site?.id === siteId);
  }

  async getEmployees(departmentId: string): Promise<Employee[]> {
    // The API does not support filtering employees by department, so we fetch all and filter client-side.
    const response = await apiService.get<PaginatedResponse<Employee>>(API_CONFIG.ENDPOINTS.EMPLOYEES);
    return response.data.items.filter(emp => emp.department?.id === departmentId);
  }
}

export default new FilterService();