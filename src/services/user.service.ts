import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { User, UserCreate, UserUpdate, PaginatedResponse, PaginationParams } from '../types';

const userService = {
  getUsers: async (params: PaginationParams = {}): Promise<PaginatedResponse<User>> => {
    const query = new URLSearchParams({
      skip: (params.skip ?? 0).toString(),
      limit: (params.limit ?? 100).toString(),
    }).toString();
    const response = await apiService.get<PaginatedResponse<User>>(`${API_CONFIG.ENDPOINTS.USERS}?${query}`);
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await apiService.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
    return response.data;
  },

  createUser: async (userData: UserCreate) => {
    const response = await apiService.post<User>(API_CONFIG.ENDPOINTS.USERS, userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: UserUpdate) => {
    const response = await apiService.put<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiService.delete<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
    return response.data;
  },

  assignRoleToUser: async (userId: string, roleId: string) => {
    const response = await apiService.post<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}/roles/${roleId}`);
    return response.data;
  },
};

export default userService;
