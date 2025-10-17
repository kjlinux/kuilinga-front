import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type {
  AdminDashboard,
  ManagerDashboard,
  EmployeeDashboard,
  IntegratorDashboard,
  AdvancedAnalytics,
} from "../types"

const { DASHBOARD_ENDPOINTS } = API_CONFIG.ENDPOINTS

const dashboardService = {
  getAdminDashboard: () =>
    apiService.get<AdminDashboard>(DASHBOARD_ENDPOINTS.ADMIN),

  getManagerDashboard: (organizationId: string) =>
    apiService.get<ManagerDashboard>(
      `${DASHBOARD_ENDPOINTS.MANAGER}/${organizationId}`,
    ),

  getEmployeeDashboard: (employeeId: string) =>
    apiService.get<EmployeeDashboard>(
      `${DASHBOARD_ENDPOINTS.EMPLOYEE}/${employeeId}`,
    ),

  getIntegratorDashboard: (organizationId: string) =>
    apiService.get<IntegratorDashboard>(
      `${DASHBOARD_ENDPOINTS.INTEGRATOR}/${organizationId}`,
    ),

  getAdvancedAnalytics: (organizationId: string) =>
    apiService.get<AdvancedAnalytics>(
      `${DASHBOARD_ENDPOINTS.ANALYTICS}/${organizationId}`,
    ),
}

export default dashboardService