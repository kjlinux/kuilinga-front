import { apiService } from './api.service';
import { Permission, PermissionCreate, PermissionUpdate, PaginatedResponse } from '../types';

const permissionService = {
  getPermissions: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<Permission>>(`/permissions?skip=${skip}&limit=${limit}`);
  },

  getPermissionById: (permissionId: string) => {
    return apiService.get<Permission>(`/permissions/${permissionId}`);
  },

  createPermission: (permissionData: PermissionCreate) => {
    return apiService.post<Permission>('/permissions', permissionData);
  },

  updatePermission: (permissionId: string, permissionData: PermissionUpdate) => {
    return apiService.put<Permission>(`/permissions/${permissionId}`, permissionData);
  },

  deletePermission: (permissionId: string) => {
    return apiService.delete<Permission>(`/permissions/${permissionId}`);
  },
};

export default permissionService;
