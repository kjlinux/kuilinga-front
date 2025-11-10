import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Role, RoleCreate, RoleUpdate, PaginatedResponse, Permission, PaginationParams } from '../types';

const roleService = {
  getRoles: async (params: PaginationParams = {}): Promise<PaginatedResponse<Role>> => {
    const query = new URLSearchParams({
      skip: (params.skip ?? 0).toString(),
      limit: (params.limit ?? 100).toString(),
    }).toString();
    const response = await apiService.get<PaginatedResponse<Role>>(`${API_CONFIG.ENDPOINTS.ROLES}?${query}`);
    return response.data;
  },

  getRoleById: async (roleId: string) => {
    const response = await apiService.get<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`);
    return response.data;
  },

  createRole: async (roleData: RoleCreate) => {
    const response = await apiService.post<Role>(API_CONFIG.ENDPOINTS.ROLES, roleData);
    return response.data;
  },

  updateRole: async (roleId: string, roleData: RoleUpdate) => {
    const response = await apiService.put<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (roleId: string) => {
    const response = await apiService.delete<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`);
    return response.data;
  },

  assignPermissionToRole: async (roleId: string, permissionId: string) => {
    const response = await apiService.post<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  // NOTE: The API does NOT provide a GET endpoint for /api/v1/roles/{role_id}/permissions
  // To get permissions for a role, use getRoleById() which includes permissions in the response
  getRolePermissions: async (roleId: string): Promise<Permission[]> => {
    // Workaround: Get the full role object which includes permissions
    const response = await apiService.get<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`);
    return response.data.permissions || [];
  }
};

export default roleService;
