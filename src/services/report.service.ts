import { client } from "@/api/client.gen";

class ReportService {
  async generateReportPreview(endpoint: string, filters: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await client.post({
      url: endpoint,
      body: filters,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data as Record<string, unknown>;
  }

  async downloadReport(endpoint: string, filters: Record<string, unknown>): Promise<void> {
    const response = await client.post({
      url: endpoint,
      body: filters,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Extract filename from content-disposition header if available
    let filename = `report.${filters.format || 'pdf'}`;
    const headers = (response as { headers?: Record<string, string> }).headers;
    if (headers) {
      const contentDisposition = headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
    }

    this.downloadFile(response.data as Blob, filename);
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
