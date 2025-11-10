/**
 * Attendance Mock Data and Handlers
 */

import { Attendance, AttendanceType, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, pageToSkipLimit } from '../utils/pagination';
import { randomUUID, randomElement } from '../utils/generators';

/**
 * Internal attendance structure (flat for easier management)
 */
interface AttendanceInternal {
  id: string;
  employee_id: string;
  device_id: string;
  timestamp: string;
  type: AttendanceType;
  geo?: string | null;
  extra_data?: Record<string, unknown> | null;
}

// Generate random GPS coordinates around Paris region
const generateGeoLocation = (): string => {
  // Paris region coordinates: ~48.8566° N, 2.3522° E
  // Add random offset within ~20km radius
  const baseLat = 48.8566;
  const baseLon = 2.3522;
  const latOffset = (Math.random() - 0.5) * 0.3; // ~20km range
  const lonOffset = (Math.random() - 0.5) * 0.3; // ~20km range

  const lat = (baseLat + latOffset).toFixed(6);
  const lon = (baseLon + lonOffset).toFixed(6);

  return `${lat},${lon}`;
};

// Generate attendance records for the last 30 days
const generateAttendanceRecords = (): AttendanceInternal[] => {
  // Lazy import to avoid circular dependency
  const { mockEmployees } = require('./employees.mock');

  const records: AttendanceInternal[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let id = 1;
  mockEmployees.slice(0, 20).forEach((employee: any) => {
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
        geo: generateGeoLocation(),
        extra_data: null,
      });

      records.push({
        id: `att-${id++}`,
        employee_id: employee.id,
        device_id: randomElement(['device-1', 'device-2', 'device-3', 'device-4', 'device-6']),
        timestamp: clockOut.toISOString(),
        type: AttendanceType.Out,
        geo: generateGeoLocation(),
        extra_data: null,
      });
    }
  });

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockAttendances = generateAttendanceRecords();

let attendancesStore = [...mockAttendances];

/**
 * GET /api/v1/attendance
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

  // Enrich attendances with employee and device data
  const enrichedAttendances = filteredAttendances.map(enrichAttendance);

  return paginate(enrichedAttendances, pageToSkipLimit(page, page_size));
};

/**
 * Enrich attendance with employee and device details
 */
const enrichAttendance = (att: AttendanceInternal): Attendance => {
  // Lazy imports to avoid circular dependencies
  const { mockEmployees } = require('./employees.mock');
  const { mockDevices } = require('./devices.mock');

  const employee = mockEmployees.find((e: any) => e.id === att.employee_id);
  const device = mockDevices.find((d: any) => d.id === att.device_id);

  return {
    id: att.id,
    timestamp: att.timestamp,
    type: att.type,
    geo: att.geo || null,
    extra_data: att.extra_data || null,
    duration: null,
    employee: employee ? {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      employee_number: employee.employee_number || null,
    } : null,
    device: device ? {
      id: device.id,
      serial_number: device.serial_number,
      type: device.type,
    } : null,
  };
};

/**
 * POST /api/v1/attendance
 */
export const createAttendanceHandler = (request: any): Attendance => {
  const data = request.body;

  if (!data.employee_id || !data.device_id || !data.type) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'employee_id, device_id, and type are required', type: 'value_error.missing' }],
    });
  }

  const now = new Date().toISOString();
  const newAttendance: AttendanceInternal = {
    id: randomUUID(),
    employee_id: data.employee_id,
    device_id: data.device_id,
    timestamp: data.timestamp || now,
    type: data.type,
    geo: data.geo || generateGeoLocation(),
    extra_data: data.extra_data || null,
  };

  attendancesStore.unshift(newAttendance);
  return enrichAttendance(newAttendance);
};

/**
 * POST /api/v1/attendance/clock
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
    pattern: '/api/v1/attendance',
    handler: getAttendancesHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/attendance',
    handler: createAttendanceHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/attendance/clock',
    handler: clockAttendanceHandler,
  },
];
