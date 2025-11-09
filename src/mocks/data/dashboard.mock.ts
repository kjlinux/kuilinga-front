/**
 * Dashboard Mock Data and Handlers
 */

import { AdminDashboard, ManagerDashboard, EmployeeDashboard, IntegratorDashboard } from '../../types';
import { DeviceStatus } from '../../types';

export const getAdminDashboardHandler = (request: any): AdminDashboard => {
  return {
    total_organizations: 5,
    total_sites: 15,
    total_employees: 450,
    total_devices: 25,
    active_employees: 442,
    inactive_employees: 8,
    online_devices: 20,
    offline_devices: 3,
    maintenance_devices: 2,
    today_attendances: 368,
    today_absences: 74,
    pending_leaves: 12,
    approved_leaves: 45,
    organizations_stats: [
      { organization_id: 'org-1', name: 'TechCorp', employee_count: 180, attendance_rate: 94.5 },
      { organization_id: 'org-2', name: 'InnovateLab', employee_count: 120, attendance_rate: 92.1 },
      { organization_id: 'org-3', name: 'GlobalServices', employee_count: 150, attendance_rate: 96.3 },
    ],
    devices_status: [
      { status: DeviceStatus.Online, count: 20 },
      { status: DeviceStatus.Offline, count: 3 },
      { status: DeviceStatus.Maintenance, count: 2 },
    ],
    attendance_trend: [
      { date: '2024-11-01', count: 412 },
      { date: '2024-11-04', count: 398 },
      { date: '2024-11-05', count: 385 },
      { date: '2024-11-06', count: 401 },
      { date: '2024-11-07', count: 395 },
      { date: '2024-11-08', count: 389 },
    ],
  };
};

export const getManagerDashboardHandler = (request: any): ManagerDashboard => {
  return {
    team_size: 15,
    present_today: 13,
    absent_today: 2,
    on_leave_today: 1,
    late_arrivals: 2,
    pending_leave_requests: 3,
    attendance_rate: 92.5,
    average_work_hours: 8.2,
    team_members: [
      { employee_id: 'emp-6', name: 'Camille Robert', status: 'present', clock_in: '08:30', clock_out: null },
      { employee_id: 'emp-7', name: 'Lucas Richard', status: 'present', clock_in: '08:45', clock_out: null },
      { employee_id: 'emp-9', name: 'Hugo Simon', status: 'absent', clock_in: null, clock_out: null },
    ],
    attendance_chart: [
      { date: '2024-11-04', present: 14, absent: 1 },
      { date: '2024-11-05', present: 13, absent: 2 },
      { date: '2024-11-06', present: 15, absent: 0 },
      { date: '2024-11-07', present: 14, absent: 1 },
      { date: '2024-11-08', present: 13, absent: 2 },
    ],
  };
};

export const getEmployeeDashboardHandler = (request: any): EmployeeDashboard => {
  return {
    employee_id: 'emp-5',
    today_status: 'present',
    clock_in_time: '08:42:15',
    clock_out_time: null,
    worked_hours_today: 0,
    worked_hours_week: 32.5,
    worked_hours_month: 145.2,
    leave_balance: {
      annual: 15,
      sick: 10,
      other: 5,
    },
    recent_attendances: [
      { date: '2024-11-08', clock_in: '08:35', clock_out: '17:22', hours: 8.78 },
      { date: '2024-11-07', clock_in: '08:48', clock_out: '17:15', hours: 8.45 },
      { date: '2024-11-06', clock_in: '08:30', clock_out: '18:05', hours: 9.58 },
    ],
    upcoming_leaves: [
      { start_date: '2024-12-20', end_date: '2024-12-31', type: 'annual', status: 'approved' },
    ],
  };
};

export const getIntegratorDashboardHandler = (request: any): IntegratorDashboard => {
  return {
    total_devices: 25,
    online_devices: 20,
    offline_devices: 3,
    maintenance_devices: 2,
    total_syncs_today: 1247,
    failed_syncs_today: 3,
    last_sync: '2024-11-09T08:35:00Z',
    devices_by_site: [
      { site_id: 'site-1', site_name: 'TechCorp Paris HQ', device_count: 3, online_count: 3 },
      { site_id: 'site-2', site_name: 'TechCorp Marseille', device_count: 2, online_count: 1 },
      { site_id: 'site-3', site_name: 'TechCorp Lyon', device_count: 1, online_count: 1 },
    ],
    sync_errors: [
      { device_id: 'device-5', device_name: 'Lecteur Biométrique Marseille - Sortie', error: 'Connection timeout', timestamp: '2024-11-08T17:45:00Z' },
    ],
  };
};

export const dashboardHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/dashboards/admin',
    handler: getAdminDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboards/manager',
    handler: getManagerDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboards/employee',
    handler: getEmployeeDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboards/integrator',
    handler: getIntegratorDashboardHandler,
  },
];
