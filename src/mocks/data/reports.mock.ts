/**
 * Reports Mock Data and Handlers
 */

import { ReportFormat } from '../../types';

/**
 * Generate mock report preview (simplified for all report types)
 */
export const generateReportPreviewHandler = (request: any): any => {
  const { report_type } = request.body;

  // Generic report structure
  return {
    report_type,
    generated_at: new Date().toISOString(),
    filters: request.body.filters || {},
    data: {
      summary: {
        total_records: 150,
        total_employees: 30,
        date_range: {
          start: request.body.filters?.start_date || '2024-10-01',
          end: request.body.filters?.end_date || '2024-10-31',
        },
      },
      records: [
        {
          employee: 'Jean Dupont',
          department: 'Informatique',
          total_hours: 168.5,
          days_worked: 22,
          average_daily_hours: 7.66,
        },
        {
          employee: 'Marie Martin',
          department: 'RH',
          total_hours: 165.2,
          days_worked: 21,
          average_daily_hours: 7.87,
        },
        {
          employee: 'Pierre Dubois',
          department: 'Commercial',
          total_hours: 172.8,
          days_worked: 22,
          average_daily_hours: 7.85,
        },
      ],
      charts: {
        attendance_by_day: [
          { day: 'Lundi', count: 28 },
          { day: 'Mardi', count: 30 },
          { day: 'Mercredi', count: 29 },
          { day: 'Jeudi', count: 30 },
          { day: 'Vendredi', count: 27 },
        ],
      },
    },
  };
};

/**
 * Download report (returns mock blob info)
 */
export const downloadReportHandler = (request: any): { download_url: string; filename: string } => {
  const { report_type, format } = request.body;
  const timestamp = Date.now();
  const ext = format === ReportFormat.PDF ? 'pdf' : format === ReportFormat.Excel ? 'xlsx' : 'csv';

  return {
    download_url: `mock://downloads/report_${report_type}_${timestamp}.${ext}`,
    filename: `report_${report_type}_${timestamp}.${ext}`,
  };
};

export const reportHandlers = [
  // Generic report handlers that match all report endpoints
  {
    method: 'POST',
    pattern: /^\/api\/v1\/reports\/.*\/preview$/,
    handler: generateReportPreviewHandler,
  },
  {
    method: 'POST',
    pattern: /^\/api\/v1\/reports\/.*\/download$/,
    handler: downloadReportHandler,
  },
];
