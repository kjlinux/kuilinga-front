import apiService from "./api.service";

class ReportService {
  async generateReportPreview(endpoint: string, filters: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await apiService.post<Record<string, unknown>>(endpoint, filters);
    return response;
  }

  async downloadReport(endpoint: string, filters: Record<string, unknown>): Promise<void> {
    const response = await apiService.post<Blob>(endpoint, filters, {
      responseType: 'blob',
    });

    // Extract filename from content-disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = `report.${filters.format || 'pdf'}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    this.downloadFile(response.data, filename);
  }

  private downloadFile(blob: Blob, filename: string) {
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