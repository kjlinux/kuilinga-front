// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",

    // Users
    EMPLOYEES: "/employees",
    EMPLOYEE_IMPORT: "/employees/import",

    // Attendance
    ATTENDANCE_REALTIME: "/attendance/realtime",
    ATTENDANCE_HISTORY: "/attendance/history",
    ATTENDANCE_MANUAL: "/attendance/manual",
    ATTENDANCE_STATS: "/attendance/stats",

    // Reports
    REPORTS: "/reports",
    REPORTS_PRESENCE: "/reports/presence",
    REPORTS_DELAYS: "/reports/delays",
    REPORTS_OVERTIME: "/reports/overtime",
    REPORTS_EXPORT: "/reports/export",
    REPORTS_STATS: "/reports/stats",

    // Organizations
    ORGANIZATIONS: "/orgs",
    SITES: "/sites",
    DEPARTMENTS: "/departments",
    CLASSES: "/classes",

    // Notifications
    NOTIFICATIONS: "/notifications",
    NOTIFICATIONS_SETTINGS: "/notifications/settings",

    // Devices
    DEVICES: "/devices",
  },
}

export default API_CONFIG
