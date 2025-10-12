import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { Attendance, AttendanceStats, PaginatedResponse, Filter } from "../types"

class AttendanceService {
  async getRealtime(filters?: Filter): Promise<Attendance[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.departement) params.append("departement", filters.departement)
    if (filters?.classe) params.append("classe", filters.classe)
    if (filters?.statut) params.append("statut", filters.statut)

    const url = `${API_CONFIG.ENDPOINTS.ATTENDANCE_REALTIME}?${params.toString()}`
    return apiService.get<Attendance[]>(url)
  }

  async getHistory(page = 1, limit = 20, filters?: Filter): Promise<PaginatedResponse<Attendance>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    if (filters?.search) params.append("search", filters.search)
    if (filters?.departement) params.append("departement", filters.departement)
    if (filters?.date) params.append("date", filters.date)

    const url = `${API_CONFIG.ENDPOINTS.ATTENDANCE_HISTORY}?${params.toString()}`
    return apiService.get<PaginatedResponse<Attendance>>(url)
  }

  async getStats(date?: string): Promise<AttendanceStats> {
    const params = date ? `?date=${date}` : ""
    return apiService.get<AttendanceStats>(`${API_CONFIG.ENDPOINTS.ATTENDANCE_STATS}${params}`)
  }

  async createManual(data: {
    employee_id: string
    type: "in" | "out"
    timestamp?: string
  }): Promise<Attendance> {
    return apiService.post<Attendance>(API_CONFIG.ENDPOINTS.ATTENDANCE_MANUAL, data)
  }
}

export default new AttendanceService()
