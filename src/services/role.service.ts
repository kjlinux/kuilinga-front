import { apiService } from './api.service';
import { Role, RoleCreate, RoleUpdate, PaginatedResponse, Permission } from '../types';

const roleService = {
  getRoles: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<Role>>(`/roles?skip=${skip}&limit=${limit}`);
  },

  getRoleById: (roleId: string) => {
    return apiService.get<Role>(`/roles/${roleId}`);
  },

  createRole: (roleData: RoleCreate) => {
    return apiService.post<Role>('/roles', roleData);
  },

  updateRole: (roleId: string, roleData: RoleUpdate) => {
    return apiService.put<Role>(`/roles/${roleId}`, roleData);
  },

  deleteRole: (roleId: string) => {
    return apiService.delete<Role>(`/roles/${roleId}`);
  },

  assignPermissionToRole: (roleId: string, permissionId: string) => {
    return apiService.post<Role>(`/roles/${roleId}/permissions/${permissionId}`);
  },

  getRolePermissions: (roleId: string) => {
    return apiService.get<Permission[]>(`/roles/${roleId}/permissions`);
  }
};

export default roleService;
