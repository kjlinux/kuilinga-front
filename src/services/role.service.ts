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

  getRolePermissions: (roleId: string) => {
    return apiService.get<Permission[]>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`);
  }
};

export default roleService;
