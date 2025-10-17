import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Site, PaginatedResponse, PaginationParams, SiteCreate, SiteUpdate } from "../types";

class SiteService {
  async getSites(params: PaginationParams = {}): Promise<PaginatedResponse<Site>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.SITES}?${query}`;
    const response = await apiService.get<PaginatedResponse<Site>>(url);
    return response.data;
  }

  async getSite(id: string): Promise<Site> {
    const response = await apiService.get<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`);
    return response.data;
  }

  async createSite(data: SiteCreate): Promise<Site> {
    const response = await apiService.post<Site>(API_CONFIG.ENDPOINTS.SITES, data);
    return response.data;
  }

  async updateSite(id: string, data: SiteUpdate): Promise<Site> {
    const response = await apiService.put<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`, data);
    return response.data;
  }

  async deleteSite(id: string): Promise<void> {
    await apiService.delete<void>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`);
  }
}

export default new SiteService();