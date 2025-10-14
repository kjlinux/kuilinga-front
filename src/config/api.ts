// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Auth
    LOGIN: "/api/v1/auth/login",
    REFRESH: "/api/v1/auth/refresh",
    ME: "/api/v1/auth/me",

    // Users
    USERS: "/api/v1/users/",

    // Organizations
    ORGANIZATIONS: "/api/v1/organizations/",

    // Employees
    EMPLOYEES: "/api/v1/employees/",

    // Devices
    DEVICES: "/api/v1/devices/",

    // Attendance
    ATTENDANCE: "/api/v1/attendance/",

    // Reports
    REPORTS_ATTENDANCE: "/api/v1/reports/attendance",

    // Departments
    DEPARTMENTS: "/api/v1/departments/",

    // Roles & Permissions
    ROLES: "/api/v1/roles/",
    PERMISSIONS: "/api/v1/permissions/",

    // Sites
    SITES: "/api/v1/sites/",

    // Leaves
    LEAVES: "/api/v1/leaves/",
  },
}

export default API_CONFIG
