/**
 * Mock System Entry Point
 *
 * This file exports the main functions to initialize and control the mock system.
 */

export { setupMockInterceptor } from './interceptor';
export { MOCK_CONFIG } from './config';
export { mockHandlers, logRegisteredHandlers } from './handlers';

// Re-export all mock data stores for testing purposes
export { mockUsers, resetUsersStore } from './data/users.mock';
export { mockRoles, resetRolesStore } from './data/roles.mock';
export { mockPermissions, resetPermissionsStore } from './data/permissions.mock';
export { mockOrganizations, resetOrganizationsStore } from './data/organizations.mock';
export { mockSites, resetSitesStore } from './data/sites.mock';
export { mockDepartments, resetDepartmentsStore } from './data/departments.mock';
export { mockEmployees, resetEmployeesStore } from './data/employees.mock';
export { mockDevices, resetDevicesStore } from './data/devices.mock';
export { mockLeaves, resetLeavesStore } from './data/leaves.mock';
export { mockAttendances, resetAttendancesStore } from './data/attendance.mock';
