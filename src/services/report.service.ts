import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { ReportFilter } from "../types"

class ReportService {
  async getPresenceReport(filters: ReportFilter): Promise<any> {
    return apiService.post(API_CONFIG.ENDPOINTS.REPORTS_PRESENCE, filters)
  }

  async getDelaysReport(filters: ReportFilter): Promise<any> {
    return apiService.post(API_CONFIG.ENDPOINTS.REPORTS_DELAYS, filters)
  }

  async getOvertimeReport(filters: ReportFilter): Promise<any> {
    return apiService.post(API_CONFIG.ENDPOINTS.REPORTS_OVERTIME, filters)
  }

  async getStats(filters: ReportFilter): Promise<any> {
    return apiService.post(API_CONFIG.ENDPOINTS.REPORTS_STATS, filters)
  }

  async exportReport(type: string, filters: ReportFilter, format: "csv" | "xlsx" | "pdf"): Promise<Blob> {
    const response = await apiService.post(
      API_CONFIG.ENDPOINTS.REPORTS_EXPORT,
      { type, filters, format },
      { responseType: "blob" },
    )
    return response as unknown as Blob
  }

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export default new ReportService()
