import { apiService } from './api.service';
import { API_CONFIG } from '../config/api';
import { User, UserCreate, UserUpdate, PaginatedResponse } from '../types';

const userService = {
  getUsers: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<User>>(`${API_CONFIG.ENDPOINTS.USERS}?skip=${skip}&limit=${limit}`);
  },

  getUserById: (userId: string) => {
    return apiService.get<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
  },

  createUser: (userData: UserCreate) => {
    return apiService.post<User>(API_CONFIG.ENDPOINTS.USERS, userData);
  },

  updateUser: (userId: string, userData: UserUpdate) => {
    return apiService.put<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`, userData);
  },

  deleteUser: (userId: string) => {
    return apiService.delete<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}`);
  },

  assignRoleToUser: (userId: string, roleId: string) => {
    return apiService.post<User>(`${API_CONFIG.ENDPOINTS.USERS}/${userId}/roles/${roleId}`);
  },
};

export default userService;
