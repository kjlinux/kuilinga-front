import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Organization, PaginatedResponse, PaginationParams, OrganizationCreate, OrganizationUpdate } from "../types";

class OrganizationService {
  async getOrganizations(params: PaginationParams = {}): Promise<PaginatedResponse<Organization>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}?${query}`;
    return apiService.get<PaginatedResponse<Organization>>(url);
  }

  async getOrganization(id: string): Promise<Organization> {
    return apiService.get<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`);
  }

  async createOrganization(data: OrganizationCreate): Promise<Organization> {
    return apiService.post<Organization>(API_CONFIG.ENDPOINTS.ORGANIZATIONS, data);
  }

  async updateOrganization(id: string, data: OrganizationUpdate): Promise<Organization> {
    return apiService.put<Organization>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`, data);
  }

  async deleteOrganization(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`);
  }
}

export default new OrganizationService();