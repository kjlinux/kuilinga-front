import apiService from "./api.service";
import { API_CONFIG } from "../config/api";
import type { ReportRequest, AttendanceReport } from "../types";

class ReportService {
  async generateAttendanceReport(request: ReportRequest): Promise<AttendanceReport> {
    const response = await apiService.post<AttendanceReport>(
      API_CONFIG.ENDPOINTS.REPORTS_ATTENDANCE,
      request,
    );
    return response;
  }

  async downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ReportService();