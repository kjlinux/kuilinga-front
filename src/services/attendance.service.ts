import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Attendance, PaginatedResponse, PaginationParams, AttendanceCreate } from "../types";

class AttendanceService {
  async getAttendances(params: PaginationParams = {}): Promise<PaginatedResponse<Attendance>> {
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 20).toString(),
        ...(params.search && { search: params.search }),
        ...(params.sort_by && { sort_by: params.sort_by }),
        ...(params.sort_order && { sort_order: params.sort_order }),
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.ATTENDANCE}?${query}`;
    const response = await apiService.get<PaginatedResponse<Attendance>>(url);
    
    if (!response) {
      throw new Error("Aucune réponse reçue de l'API");
    }
    
    return response;
  }

  async createAttendance(data: AttendanceCreate): Promise<Attendance | undefined> {
    return apiService.post<Attendance>(API_CONFIG.ENDPOINTS.ATTENDANCE, data);
  }
}

export default new AttendanceService();