import {
  getAdminDashboardDataApiV1DashboardAdminGet,
  getManagerDashboardDataApiV1DashboardManagerOrganizationIdGet,
  getEmployeeDashboardDataApiV1DashboardEmployeeEmployeeIdGet,
  getIntegratorDashboardDataApiV1DashboardIntegratorOrganizationIdGet,
  getAdvancedAnalyticsDataApiV1DashboardAnalyticsOrganizationIdGet,
} from "@/api";
import type {
  AdminDashboard,
  ManagerDashboard,
  EmployeeDashboard,
  IntegratorDashboard,
  AdvancedAnalytics,
} from "@/api";

const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboard> => {
    const response = await getAdminDashboardDataApiV1DashboardAdminGet();
    return response.data as AdminDashboard;
  },

  getManagerDashboard: async (organizationId: string): Promise<ManagerDashboard> => {
    const response = await getManagerDashboardDataApiV1DashboardManagerOrganizationIdGet({
      path: { organization_id: organizationId },
    });
    return response.data as ManagerDashboard;
  },

  getEmployeeDashboard: async (employeeId: string): Promise<EmployeeDashboard> => {
    const response = await getEmployeeDashboardDataApiV1DashboardEmployeeEmployeeIdGet({
      path: { employee_id: employeeId },
    });
    return response.data as EmployeeDashboard;
  },

  getIntegratorDashboard: async (organizationId: string): Promise<IntegratorDashboard> => {
    const response = await getIntegratorDashboardDataApiV1DashboardIntegratorOrganizationIdGet({
      path: { organization_id: organizationId },
    });
    return response.data as IntegratorDashboard;
  },

  getAdvancedAnalytics: async (organizationId: string): Promise<AdvancedAnalytics> => {
    const response = await getAdvancedAnalyticsDataApiV1DashboardAnalyticsOrganizationIdGet({
      path: { organization_id: organizationId },
    });
    return response.data as AdvancedAnalytics;
  },
};

export default dashboardService;
