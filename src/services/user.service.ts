import {
  readUsersApiV1UsersGet,
  readUserApiV1UsersUserIdGet,
  createUserApiV1UsersPost,
  updateUserApiV1UsersUserIdPut,
  deleteUserApiV1UsersUserIdDelete,
  assignRoleToUserApiV1UsersUserIdRolesRoleIdPost,
} from "@/api";
import type {
  User,
  UserCreate,
  UserUpdate,
  PaginatedResponseUser,
} from "@/api";
import type { PaginationParams, PaginatedResponse } from "@/hooks/useDataTable";

const userService = {
  getUsers: async (params: PaginationParams = {}): Promise<PaginatedResponse<User>> => {
    const response = await readUsersApiV1UsersGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        sort_by: params.sort_by ?? "created_at",
        sort_order: params.sort_order ?? "desc",
      },
    });
    const data = response.data as PaginatedResponseUser;
    return {
      items: data.items,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  getUserById: async (userId: string) => {
    const response = await readUserApiV1UsersUserIdGet({
      path: { user_id: userId },
    });
    return { data: response.data as User };
  },

  createUser: async (userData: UserCreate) => {
    const response = await createUserApiV1UsersPost({
      body: userData,
    });
    return { data: response.data as User };
  },

  updateUser: async (userId: string, userData: UserUpdate) => {
    const response = await updateUserApiV1UsersUserIdPut({
      path: { user_id: userId },
      body: userData,
    });
    return { data: response.data as User };
  },

  deleteUser: async (userId: string) => {
    const response = await deleteUserApiV1UsersUserIdDelete({
      path: { user_id: userId },
    });
    return { data: response.data as User };
  },

  assignRoleToUser: async (userId: string, roleId: string) => {
    const response = await assignRoleToUserApiV1UsersUserIdRolesRoleIdPost({
      path: { user_id: userId, role_id: roleId },
    });
    return { data: response.data as User };
  },
};

export default userService;
