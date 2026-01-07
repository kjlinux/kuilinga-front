import {
  readRolesApiV1RolesGet,
  readRoleApiV1RolesRoleIdGet,
  createRoleApiV1RolesPost,
  updateRoleApiV1RolesRoleIdPut,
  deleteRoleApiV1RolesRoleIdDelete,
  assignPermissionToRoleApiV1RolesRoleIdPermissionsPermissionIdPost,
} from "@/api";
import type {
  Role,
  RoleCreate,
  RoleUpdate,
  Permission,
  PaginatedResponseRole,
} from "@/api";

const roleService = {
  getRoles: async (skip = 0, limit = 100) => {
    const response = await readRolesApiV1RolesGet({
      query: { skip, limit },
    });
    return { data: response.data as PaginatedResponseRole };
  },

  getRoleById: async (roleId: string) => {
    const response = await readRoleApiV1RolesRoleIdGet({
      path: { role_id: roleId },
    });
    return { data: response.data as Role };
  },

  createRole: async (roleData: RoleCreate) => {
    const response = await createRoleApiV1RolesPost({
      body: roleData,
    });
    return { data: response.data as Role };
  },

  updateRole: async (roleId: string, roleData: RoleUpdate) => {
    const response = await updateRoleApiV1RolesRoleIdPut({
      path: { role_id: roleId },
      body: roleData,
    });
    return { data: response.data as Role };
  },

  deleteRole: async (roleId: string) => {
    const response = await deleteRoleApiV1RolesRoleIdDelete({
      path: { role_id: roleId },
    });
    return { data: response.data as Role };
  },

  assignPermissionToRole: async (roleId: string, permissionId: string) => {
    const response = await assignPermissionToRoleApiV1RolesRoleIdPermissionsPermissionIdPost({
      path: { role_id: roleId, permission_id: permissionId },
    });
    return { data: response.data as Role };
  },

  // NOTE: The API does NOT provide a GET endpoint for /api/v1/roles/{role_id}/permissions
  // To get permissions for a role, use getRoleById() which includes permissions in the response
  getRolePermissions: async (roleId: string): Promise<Permission[]> => {
    // Workaround: Get the full role object which includes permissions
    const response = await readRoleApiV1RolesRoleIdGet({
      path: { role_id: roleId },
    });
    const role = response.data as Role;
    return role.permissions || [];
  }
};

export default roleService;
