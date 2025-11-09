/**
 * Centralized Mock Handlers Registry
 *
 * This file aggregates all mock handlers from different data modules
 * and exports them as a single array for the mock interceptor.
 */

import { authHandlers } from '../data/auth.mock';
import { userHandlers } from '../data/users.mock';
import { roleHandlers } from '../data/roles.mock';
import { permissionHandlers } from '../data/permissions.mock';
import { organizationHandlers } from '../data/organizations.mock';
import { siteHandlers } from '../data/sites.mock';
import { departmentHandlers } from '../data/departments.mock';
import { employeeHandlers } from '../data/employees.mock';
import { deviceHandlers } from '../data/devices.mock';
import { leaveHandlers } from '../data/leaves.mock';
import { attendanceHandlers } from '../data/attendance.mock';
import { dashboardHandlers } from '../data/dashboard.mock';
import { reportHandlers } from '../data/reports.mock';
import { notificationHandlers } from '../data/notifications.mock';

/**
 * Handler type definition
 */
export interface MockHandler {
  method: string;
  pattern: string;
  handler: (request: any) => any;
}

/**
 * All mock handlers combined
 */
export const mockHandlers: MockHandler[] = [
  // Authentication
  ...authHandlers,

  // User Management
  ...userHandlers,
  ...roleHandlers,
  ...permissionHandlers,

  // Organization Hierarchy
  ...organizationHandlers,
  ...siteHandlers,
  ...departmentHandlers,

  // Employees
  ...employeeHandlers,

  // Devices
  ...deviceHandlers,

  // Leaves
  ...leaveHandlers,

  // Attendance
  ...attendanceHandlers,

  // Dashboards
  ...dashboardHandlers,

  // Reports
  ...reportHandlers,

  // Notifications
  ...notificationHandlers,
];

/**
 * Log all registered handlers (for debugging)
 */
export const logRegisteredHandlers = (): void => {
  console.log('[MOCK] Registered handlers:');
  mockHandlers.forEach(handler => {
    console.log(`  ${handler.method} ${handler.pattern}`);
  });
};
