// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "",
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Auth
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/refresh",
    ME: "/api/v1/auth/me",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",

    // Users
    USERS: "/api/v1/users/",
    EMPLOYEES: "/api/v1/employees/",
    EMPLOYEE_IMPORT: "/api/v1/employees/import/",

    // Attendance
    ATTENDANCE: "/api/v1/attendance/",
    // NOTE: The following attendance endpoints are NOT defined in the API spec and are unused:
    // ATTENDANCE_REALTIME, ATTENDANCE_HISTORY, ATTENDANCE_MANUAL, ATTENDANCE_STATS

    // Reports
    REPORTS: "/api/v1/reports/",
    // NOTE: The following report endpoints are NOT defined in the API spec and are unused:
    // REPORTS_PRESENCE, REPORTS_ATTENDANCE, REPORTS_DELAYS, REPORTS_OVERTIME, REPORTS_EXPORT, REPORTS_STATS
    // Instead, use the dynamic report endpoints from reports.config.ts (R1-R20)

    // Organizations
    ORGANIZATIONS: "/api/v1/organizations/",
    SITES: "/api/v1/sites/",
    DEPARTMENTS: "/api/v1/departments/",
    // NOTE: CLASSES endpoint is NOT defined in the API spec and is unused

    // Leaves
    LEAVES: "/api/v1/leaves/",

    // Roles & Permissions
    ROLES: "/api/v1/roles/",
    PERMISSIONS: "/api/v1/permissions/",

    // Notifications
    NOTIFICATIONS: "/api/v1/notifications/",
    NOTIFICATIONS_SETTINGS: "/api/v1/notifications/settings/",

    // Devices
    DEVICES: "/api/v1/devices/",

    // Dashboards
    DASHBOARD_ENDPOINTS: {
      ADMIN: "/api/v1/dashboard/admin",
      MANAGER: "/api/v1/dashboard/manager",
      EMPLOYEE: "/api/v1/dashboard/employee",
      INTEGRATOR: "/api/v1/dashboard/integrator",
      ANALYTICS: "/api/v1/dashboard/analytics",
    },

    // Health
    HEALTH: "/health/",
  },
}

export default API_CONFIG