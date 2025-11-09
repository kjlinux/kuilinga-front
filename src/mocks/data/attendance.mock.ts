/**
 * Attendance Mock Data and Handlers
 */

import { Attendance, AttendanceType, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate } from '../utils/pagination';
import { randomUUID, randomISODate, randomElement } from '../utils/generators';
import { mockEmployees } from './employees.mock';

// Generate attendance records for the last 30 days
const generateAttendanceRecords = (): Attendance[] => {
  const records: Attendance[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let id = 1;
  mockEmployees.slice(0, 20).forEach(employee => {
    // Generate 20-25 attendance records per employee
    for (let day = 0; day < 25; day++) {
      const date = new Date(thirtyDaysAgo.getTime() + day * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);
      const clockInHour = 8 + Math.floor(Math.random() * 2); // 8-10 AM
      const clockOutHour = 17 + Math.floor(Math.random() * 3); // 5-8 PM

      const clockIn = new Date(date);
      clockIn.setHours(clockInHour, Math.floor(Math.random() * 60), 0);

      const clockOut = new Date(date);
      clockOut.setHours(clockOutHour, Math.floor(Math.random() * 60), 0);

      records.push({
        id: `att-${id++}`,
        employee_id: employee.id,
        device_id: randomElement(['device-1', 'device-2', 'device-3', 'device-4', 'device-6']),
        timestamp: clockIn.toISOString(),
        type: AttendanceType.In,
        created_at: clockIn.toISOString(),
      });

      records.push({
        id: `att-${id++}`,
        employee_id: employee.id,
        device_id: randomElement(['device-1', 'device-2', 'device-3', 'device-4', 'device-6']),
        timestamp: clockOut.toISOString(),
        type: AttendanceType.Out,
        created_at: clockOut.toISOString(),
      });
    }
  });

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockAttendances = generateAttendanceRecords();

let attendancesStore = [...mockAttendances];

/**
 * GET /api/v1/attendances
 */
export const getAttendancesHandler = (request: any): PaginatedResponse<Attendance> => {
  const { page, page_size, employee_id, device_id, start_date, end_date, type } = request.query;

  let filteredAttendances = [...attendancesStore];

  if (employee_id) {
    filteredAttendances = filteredAttendances.filter(a => a.employee_id === employee_id);
  }

  if (device_id) {
    filteredAttendances = filteredAttendances.filter(a => a.device_id === device_id);
  }

  if (type) {
    filteredAttendances = filteredAttendances.filter(a => a.type === type);
  }

  if (start_date) {
    filteredAttendances = filteredAttendances.filter(a => a.timestamp >= start_date);
  }

  if (end_date) {
    filteredAttendances = filteredAttendances.filter(a => a.timestamp <= end_date);
  }

  return paginate(filteredAttendances, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * POST /api/v1/attendances
 */
export const createAttendanceHandler = (request: any): Attendance => {
  const data = request.body;

  if (!data.employee_id || !data.device_id || !data.type) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'employee_id, device_id, and type are required', type: 'value_error.missing' }],
    });
  }

  const now = new Date().toISOString();
  const newAttendance: Attendance = {
    id: randomUUID(),
    employee_id: data.employee_id,
    device_id: data.device_id,
    timestamp: data.timestamp || now,
    type: data.type,
    created_at: now,
  };

  attendancesStore.unshift(newAttendance);
  return newAttendance;
};

/**
 * POST /api/v1/attendances/clock
 */
export const clockAttendanceHandler = (request: any): Attendance => {
  return createAttendanceHandler(request);
};

export const resetAttendancesStore = () => {
  attendancesStore = [...mockAttendances];
};

export const attendanceHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/attendances',
    handler: getAttendancesHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/attendances',
    handler: createAttendanceHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/attendances/clock',
    handler: clockAttendanceHandler,
  },
];
