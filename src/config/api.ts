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
    USERS: "/api/v1/users",
    EMPLOYEES: "/api/v1/employees",
    EMPLOYEE_IMPORT: "/api/v1/employees/import",

    // Attendance
    ATTENDANCE: "/api/v1/attendance",
    ATTENDANCE_REALTIME: "/api/v1/attendance/realtime",
    ATTENDANCE_HISTORY: "/api/v1/attendance/history",
    ATTENDANCE_MANUAL: "/api/v1/attendance/manual",
    ATTENDANCE_STATS: "/api/v1/attendance/stats",

    // Reports
    REPORTS: "/api/v1/reports",
    REPORTS_PRESENCE: "/api/v1/reports/presence",
    REPORTS_ATTENDANCE: "/api/v1/reports/attendance",
    REPORTS_DELAYS: "/api/v1/reports/delays",
    REPORTS_OVERTIME: "/api/v1/reports/overtime",
    REPORTS_EXPORT: "/api/v1/reports/export",
    REPORTS_STATS: "/api/v1/reports/stats",

    // Organizations
    ORGANIZATIONS: "/api/v1/organizations",
    SITES: "/api/v1/sites",
    DEPARTMENTS: "/api/v1/departments",
    CLASSES: "/api/v1/classes",

    // Leaves
    LEAVES: "/api/v1/leaves",

    // Roles & Permissions
    ROLES: "/api/v1/roles",
    PERMISSIONS: "/api/v1/permissions",

    // Notifications
    NOTIFICATIONS: "/api/v1/notifications",
    NOTIFICATIONS_SETTINGS: "/api/v1/notifications/settings",

    // Devices
    DEVICES: "/api/v1/devices",

    // Dashboards
    DASHBOARD_ENDPOINTS: {
      ADMIN: "/api/v1/dashboard/admin",
      MANAGER: "/api/v1/dashboard/manager",
      EMPLOYEE: "/api/v1/dashboard/employee",
      INTEGRATOR: "/api/v1/dashboard/integrator",
      ANALYTICS: "/api/v1/dashboard/analytics",
    },

    // Health
    HEALTH: "/health",
  },
}

export default API_CONFIG