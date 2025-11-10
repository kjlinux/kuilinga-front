/**
 * Mock Handlers Registry
 *
 * This file collects all mock handlers from different data modules
 * and exports them as a single array for the mock interceptor to use.
 */

import { authHandlers } from './data/auth.mock';
import { userHandlers } from './data/users.mock';
import { roleHandlers } from './data/roles.mock';
import { permissionHandlers } from './data/permissions.mock';
import { organizationHandlers } from './data/organizations.mock';
import { siteHandlers } from './data/sites.mock';
import { departmentHandlers } from './data/departments.mock';
import { employeeHandlers } from './data/employees.mock';
import { deviceHandlers } from './data/devices.mock';
import { leaveHandlers } from './data/leaves.mock';
import { attendanceHandlers } from './data/attendance.mock';
import { dashboardHandlers } from './data/dashboard.mock';
import { reportHandlers } from './data/reports.mock';
import { notificationHandlers } from './data/notifications.mock';

/**
 * All registered mock handlers
 */
export const mockHandlers = [
  ...authHandlers,
  ...userHandlers,
  ...roleHandlers,
  ...permissionHandlers,
  ...organizationHandlers,
  ...siteHandlers,
  ...departmentHandlers,
  ...employeeHandlers,
  ...deviceHandlers,
  ...leaveHandlers,
  ...attendanceHandlers,
  ...dashboardHandlers,
  ...reportHandlers,
  ...notificationHandlers,
];

/**
 * Logs all registered handlers for debugging
 */
export const logRegisteredHandlers = () => {
  console.log('[MOCK] Registered handlers:');
  mockHandlers.forEach((handler, index) => {
    console.log(`  ${index + 1}. ${handler.method} ${handler.pattern}`);
  });
  console.log(`[MOCK] Total: ${mockHandlers.length} handlers`);
};
