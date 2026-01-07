import {
  readPermissionsApiV1PermissionsGet,
  readPermissionApiV1PermissionsPermissionIdGet,
  createPermissionApiV1PermissionsPost,
  updatePermissionApiV1PermissionsPermissionIdPut,
  deletePermissionApiV1PermissionsPermissionIdDelete,
} from "@/api";
import type {
  Permission,
  PermissionCreate,
  PermissionUpdate,
  PaginatedResponsePermission,
} from "@/api";
import type { PaginationParams, PaginatedResponse } from "@/hooks/useDataTable";

const permissionService = {
  getPermissions: async (params: PaginationParams = {}): Promise<PaginatedResponse<Permission>> => {
    const response = await readPermissionsApiV1PermissionsGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 20,
      },
    });
    const data = response.data as PaginatedResponsePermission;
    return {
      items: data.items,
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  getPermissionById: async (permissionId: string) => {
    const response = await readPermissionApiV1PermissionsPermissionIdGet({
      path: { permission_id: permissionId },
    });
    return { data: response.data as Permission };
  },

  createPermission: async (permissionData: PermissionCreate) => {
    const response = await createPermissionApiV1PermissionsPost({
      body: permissionData,
    });
    return { data: response.data as Permission };
  },

  updatePermission: async (permissionId: string, permissionData: PermissionUpdate) => {
    const response = await updatePermissionApiV1PermissionsPermissionIdPut({
      path: { permission_id: permissionId },
      body: permissionData,
    });
    return { data: response.data as Permission };
  },

  deletePermission: async (permissionId: string) => {
    const response = await deletePermissionApiV1PermissionsPermissionIdDelete({
      path: { permission_id: permissionId },
    });
    return { data: response.data as Permission };
  },
};

export default permissionService;
