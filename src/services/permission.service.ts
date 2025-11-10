import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { Permission, PermissionCreate, PermissionUpdate, PaginatedResponse, PaginationParams } from '../types';

const permissionService = {
  getPermissions: async (params: PaginationParams = {}): Promise<PaginatedResponse<Permission>> => {
    const query = new URLSearchParams({
      skip: (params.skip ?? 0).toString(),
      limit: (params.limit ?? 100).toString(),
    }).toString();
    const response = await apiService.get<PaginatedResponse<Permission>>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}?${query}`);
    return response.data;
  },

  getPermissionById: async (permissionId: string) => {
    const response = await apiService.get<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`);
    return response.data;
  },

  createPermission: async (permissionData: PermissionCreate) => {
    const response = await apiService.post<Permission>(API_CONFIG.ENDPOINTS.PERMISSIONS, permissionData);
    return response.data;
  },

  updatePermission: async (permissionId: string, permissionData: PermissionUpdate) => {
    const response = await apiService.put<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`, permissionData);
    return response.data;
  },

  deletePermission: async (permissionId: string) => {
    const response = await apiService.delete<Permission>(`${API_CONFIG.ENDPOINTS.PERMISSIONS}/${permissionId}`);
    return response.data;
  },
};

export default permissionService;
