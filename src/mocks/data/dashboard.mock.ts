/**
 * Dashboard Mock Data and Handlers
 */

import { AdminDashboard, ManagerDashboard, EmployeeDashboard, IntegratorDashboard, AttendanceType } from '../../types';
import { mockEmployees } from './employees.mock';
import { mockDevices } from './devices.mock';

export const getAdminDashboardHandler = (): AdminDashboard => {
  return {
    active_organizations: 5,
    daily_attendance_count: 368,
    users_per_organization: [
      { name: 'TechCorp', user_count: 45 },
      { name: 'InnovateLab', user_count: 32 },
      { name: 'GlobalServices', user_count: 38 },
      { name: 'DataTech Solutions', user_count: 28 },
      { name: 'CloudNet Systems', user_count: 22 },
    ],
    sites_per_organization: [
      { name: 'TechCorp', site_count: 5 },
      { name: 'InnovateLab', site_count: 3 },
      { name: 'GlobalServices', site_count: 4 },
      { name: 'DataTech Solutions', site_count: 2 },
      { name: 'CloudNet Systems', site_count: 1 },
    ],
    device_status_ratio: [
      { status: 'online', count: 20 },
      { status: 'offline', count: 3 },
      { status: 'maintenance', count: 2 },
    ],
    plan_distribution: [
      { plan: 'Enterprise', count: 2 },
      { plan: 'Professional', count: 2 },
      { plan: 'Basic', count: 1 },
    ],
    top_10_organizations_by_employees: [
      { name: 'TechCorp', employee_count: 180 },
      { name: 'GlobalServices', employee_count: 150 },
      { name: 'InnovateLab', employee_count: 120 },
      { name: 'DataTech Solutions', employee_count: 85 },
      { name: 'CloudNet Systems', employee_count: 65 },
    ],
  };
};

export const getManagerDashboardHandler = (): ManagerDashboard => {
  // Generate some real-time attendances for today
  const today = new Date();
  const realTimeAttendances = mockEmployees.slice(0, 5).map((emp: any, idx: number) => {
    const clockIn = new Date(today);
    clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);

    return {
      id: `att-rt-${idx + 1}`,
      employee_id: emp.id,
      device_id: mockDevices[idx % mockDevices.length]?.id || 'device-1',
      timestamp: clockIn.toISOString(),
      type: AttendanceType.In,
      created_at: clockIn.toISOString(),
      employee: {
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        employee_number: emp.employee_number,
      },
      device: mockDevices[idx % mockDevices.length] ? {
        id: mockDevices[idx % mockDevices.length].id,
        serial_number: mockDevices[idx % mockDevices.length].serial_number,
        type: mockDevices[idx % mockDevices.length].type,
      } : undefined,
    };
  });

  return {
    present_today: 13,
    absent_today: 2,
    tardy_today: 2,
    attendance_rate: 0.925,
    total_work_hours: 123.5,
    pending_leaves: 3,
    presence_evolution: [
      { date: '2024-11-04', presence_count: 14 },
      { date: '2024-11-05', presence_count: 13 },
      { date: '2024-11-06', presence_count: 15 },
      { date: '2024-11-07', presence_count: 14 },
      { date: '2024-11-08', presence_count: 13 },
    ],
    presence_absence_tardiness_distribution: {
      present: 13,
      absent: 2,
      tardy: 2,
    },
    real_time_attendances: realTimeAttendances,
  };
};

export const getEmployeeDashboardHandler = (): EmployeeDashboard => {
  const today = new Date();
  const todayAttendances = [
    {
      id: 'att-emp-1',
      employee_id: 'emp-5',
      device_id: mockDevices[0]?.id || 'device-1',
      timestamp: new Date(today.setHours(8, 42, 15)).toISOString(),
      type: AttendanceType.In,
      created_at: new Date(today.setHours(8, 42, 15)).toISOString(),
      employee: mockEmployees[4] ? {
        id: mockEmployees[4].id,
        first_name: mockEmployees[4].first_name,
        last_name: mockEmployees[4].last_name,
        employee_number: mockEmployees[4].employee_number,
      } : undefined,
      device: mockDevices[0] ? {
        id: mockDevices[0].id,
        serial_number: mockDevices[0].serial_number,
        type: mockDevices[0].type,
      } : undefined,
    },
  ];

  return {
    today_attendances: todayAttendances,
    monthly_attendance_rate: 0.952,
    leave_balance: {
      total: 30,
      used: 5,
      available: 25,
    },
  };
};

export const getIntegratorDashboardHandler = (): IntegratorDashboard => {
  return {
    device_status_ratio: [
      { status: 'online', count: 20 },
      { status: 'offline', count: 3 },
      { status: 'maintenance', count: 2 },
    ],
    attendance_per_device: mockDevices.slice(0, 8).map((device: any) => ({
      serial_number: device.serial_number,
      attendance_count: 120 + Math.floor(Math.random() * 80),
    })),
  };
};

export const dashboardHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/dashboard/admin',
    handler: getAdminDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboard/manager/:organizationId',
    handler: getManagerDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboard/employee/:employeeId',
    handler: getEmployeeDashboardHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/dashboard/integrator/:organizationId',
    handler: getIntegratorDashboardHandler,
  },
];
