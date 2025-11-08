import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Permission, PermissionCreate, PermissionUpdate, PaginatedResponse } from '../types';

const permissionService = {
  getPermissions: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<Permission>>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}?skip=${skip}&limit=${limit}`);
  },

  getPermissionById: (permissionId: string) => {
    return apiService.get<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`);
  },

  createPermission: (permissionData: PermissionCreate) => {
    return apiService.post<Permission>(API_CONFIG.ENDPOINTS.PERMISSIONS, permissionData);
  },

  updatePermission: (permissionId: string, permissionData: PermissionUpdate) => {
    return apiService.put<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`, permissionData);
  },

  deletePermission: (permissionId: string) => {
    return apiService.delete<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`);
  },
};

export default permissionService;
