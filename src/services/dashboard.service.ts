import { apiService } from "./api.service"
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
  getAdminDashboard: async () => {
    const response = await apiService.get<AdminDashboard>(DASHBOARD_ENDPOINTS.ADMIN)
    return response.data
  },

  getManagerDashboard: async (organizationId: string) => {
    const response = await apiService.get<ManagerDashboard>(
      `${DASHBOARD_ENDPOINTS.MANAGER}/${organizationId}`,
    )
    return response.data
  },

  getEmployeeDashboard: async (employeeId: string) => {
    const response = await apiService.get<EmployeeDashboard>(
      `${DASHBOARD_ENDPOINTS.EMPLOYEE}/${employeeId}`,
    )
    return response.data
  },

  getIntegratorDashboard: async (organizationId: string) => {
    const response = await apiService.get<IntegratorDashboard>(
      `${DASHBOARD_ENDPOINTS.INTEGRATOR}/${organizationId}`,
    )
    return response.data
  },

  getAdvancedAnalytics: async (organizationId: string) => {
    const response = await apiService.get<AdvancedAnalytics>(
      `${DASHBOARD_ENDPOINTS.ANALYTICS}/${organizationId}`,
    )
    return response.data
  },
}

export default dashboardService