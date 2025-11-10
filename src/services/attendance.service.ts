import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import type { Attendance, PaginatedResponse, PaginationParams, AttendanceCreate } from "../types";

class AttendanceService {
  async getAttendances(params: PaginationParams = {}): Promise<PaginatedResponse<Attendance>> {
    // NOTE: API only supports 'skip', 'limit', and 'employee_id' parameters.
    // 'search', 'sort_by', 'sort_order' are NOT supported by the backend API.
    const query = new URLSearchParams({
        skip: (params.skip ?? 0).toString(),
        limit: (params.limit ?? 20).toString(),
        // employee_id can be added when filtering by employee
    }).toString();

    const url = `${API_CONFIG.ENDPOINTS.ATTENDANCE}?${query}`;
    const response = await apiService.get<PaginatedResponse<Attendance>>(url);

    if (!response || !response.data) {
      throw new Error("Aucune réponse reçue de l'API");
    }

    return response.data;
  }

  async createAttendance(data: AttendanceCreate): Promise<Attendance | undefined> {
    const response = await apiService.post<Attendance>(API_CONFIG.ENDPOINTS.ATTENDANCE, data);
    return response.data;
  }

  // Clock in/out endpoint - uses dedicated /api/v1/attendance/clock endpoint
  async clockAttendance(employeeId: string, attendanceType: "in" | "out"): Promise<Attendance> {
    const response = await apiService.post<Attendance>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCE}clock`,
      {
        employee_id: employeeId,
        attendance_type: attendanceType,
      }
    );
    return response.data;
  }
}

export default new AttendanceService();