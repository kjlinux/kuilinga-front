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
    return apiService.get<PaginatedResponse<Site>>(url);
  }

  async getSite(id: string): Promise<Site> {
    return apiService.get<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`);
  }

  async createSite(data: SiteCreate): Promise<Site> {
    return apiService.post<Site>(API_CONFIG.ENDPOINTS.SITES, data);
  }

  async updateSite(id: string, data: SiteUpdate): Promise<Site> {
    return apiService.put<Site>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`, data);
  }

  async deleteSite(id: string): Promise<void> {
    return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.SITES}/${id}`);
  }
}

export default new SiteService();