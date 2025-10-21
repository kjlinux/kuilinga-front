import { apiService } from './api.service';
import { User, UserCreate, UserUpdate, PaginatedResponse } from '../types';

const userService = {
  getUsers: (skip = 0, limit = 100) => {
    return apiService.get<PaginatedResponse<User>>(`/users?skip=${skip}&limit=${limit}`);
  },

  getUserById: (userId: string) => {
    return apiService.get<User>(`/users/${userId}`);
  },

  createUser: (userData: UserCreate) => {
    return apiService.post<User>('/users', userData);
  },

  updateUser: (userId: string, userData: UserUpdate) => {
    return apiService.put<User>(`/users/${userId}`, userData);
  },

  deleteUser: (userId: string) => {
    return apiService.delete<User>(`/users/${userId}`);
  },

  assignRoleToUser: (userId: string, roleId: string) => {
    return apiService.post<User>(`/users/${userId}/roles/${roleId}`);
  },
};

export default userService;
