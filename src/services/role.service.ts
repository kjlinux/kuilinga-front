import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Role, RoleCreate, RoleUpdate, PaginatedResponse, Permission } from '../types';

const roleService = {
  getRoles: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<Role>>(`${API_CONFIG.ENDPOINTS.ROLES}?skip=${skip}&limit=${limit}`);
  },

  getRoleById: (roleId: string) => {
    return apiService.get<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`);
  },

  createRole: (roleData: RoleCreate) => {
    return apiService.post<Role>(API_CONFIG.ENDPOINTS.ROLES, roleData);
  },

  updateRole: (roleId: string, roleData: RoleUpdate) => {
    return apiService.put<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`, roleData);
  },

  deleteRole: (roleId: string) => {
    return apiService.delete<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}`);
  },

  assignPermissionToRole: (roleId: string, permissionId: string) => {
    return apiService.post<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions/${permissionId}`);
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
