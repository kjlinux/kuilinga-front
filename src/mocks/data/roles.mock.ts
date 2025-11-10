/**
 * Roles Mock Data and Handlers
 */

import { Role, Permission, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockPermissions } from './permissions.mock';

/**
 * Helper to get permissions by IDs
 */
const getPermissionsByIds = (ids: string[]): Permission[] => {
  return ids
    .map(id => mockPermissions.find(p => p.id === id))
    .filter((p): p is Permission => p !== undefined);
};

/**
 * Initial mock roles data with assigned permissions
 */
export const mockRoles: Role[] = [
  {
    id: 'role-super-admin',
    name: 'super-admin',
    description: 'Super Administrator with full system access',
    permissions: [...mockPermissions], // All permissions
  },
  {
    id: 'role-admin-org',
    name: 'admin-organization',
    description: 'Organization Administrator',
    permissions: getPermissionsByIds([
      // Users: all
      'perm-1', 'perm-2', 'perm-3', 'perm-4',
      // Employees: all
      'perm-5', 'perm-6', 'perm-7', 'perm-8',
      // Organizations: read, update only (no create/delete)
      'perm-9', 'perm-11',
      // Attendance: all
      'perm-13', 'perm-14', 'perm-15', 'perm-16',
      // Devices: all
      'perm-17', 'perm-18', 'perm-19', 'perm-20',
      // Leaves: all
      'perm-21', 'perm-22', 'perm-23', 'perm-24',
      // Reports: all
      'perm-25', 'perm-26', 'perm-27',
      // Roles: all
      'perm-28', 'perm-29', 'perm-30',
    ]),
  },
  {
    id: 'role-rh',
    name: 'rh',
    description: 'Human Resources Manager',
    permissions: getPermissionsByIds([
      // Employees: all
      'perm-5', 'perm-6', 'perm-7', 'perm-8',
      // Attendance: read, create, update
      'perm-13', 'perm-14', 'perm-15',
      // Leaves: all
      'perm-21', 'perm-22', 'perm-23', 'perm-24',
      // Reports: all
      'perm-25', 'perm-26', 'perm-27',
    ]),
  },
  {
    id: 'role-manager',
    name: 'manager',
    description: 'Team Manager',
    permissions: getPermissionsByIds([
      // Employees: read only
      'perm-5',
      // Attendance: read only
      'perm-13',
      // Leaves: read, approve, reject
      'perm-21', 'perm-23', 'perm-24',
      // Reports: read, generate
      'perm-25', 'perm-26',
    ]),
  },
  {
    id: 'role-employee',
    name: 'employee',
    description: 'Standard Employee',
    permissions: getPermissionsByIds([
      // Attendance: read only
      'perm-13',
      // Leaves: read, create
      'perm-21', 'perm-22',
      // Reports: read only
      'perm-25',
    ]),
  },
  {
    id: 'role-integrator',
    name: 'integrator',
    description: 'System Integrator',
    permissions: getPermissionsByIds([
      // Devices: all
      'perm-17', 'perm-18', 'perm-19', 'perm-20',
      // Attendance: read, create
      'perm-13', 'perm-14',
    ]),
  },
];

/**
 * In-memory store
 */
let rolesStore = [...mockRoles];

/**
 * GET /api/v1/roles
 */
export const getRolesHandler = (request: any): PaginatedResponse<Role> => {
  const { page, page_size, search } = request.query;

  let filteredRoles = [...rolesStore];

  if (search) {
    filteredRoles = filterBySearch(filteredRoles, search, ['name', 'description']);
  }

  return paginate(filteredRoles, pageToSkipLimit(page, page_size));
};

/**
 * GET /api/v1/roles/:id
 */
export const getRoleByIdHandler = (request: any): Role => {
  const { id } = request.params;
  const role = rolesStore.find(r => r.id === id);

  if (!role) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  return role;
};

/**
 * POST /api/v1/roles
 */
export const createRoleHandler = (request: any): Role => {
  const data = request.body;

  if (!data.name) {
    throw createMockError(422, {
      detail: [{ loc: ['body', 'name'], msg: 'field required', type: 'value_error.missing' }],
    });
  }

  if (rolesStore.some(r => r.name === data.name)) {
    throw createMockError(400, { detail: 'Role name already exists' });
  }

  const newRole: Role = {
    id: randomUUID(),
    name: data.name,
    description: data.description || null,
    permissions: data.permissions || [],
  };

  rolesStore.push(newRole);
  return newRole;
};

/**
 * PUT /api/v1/roles/:id
 */
export const updateRoleHandler = (request: any): Role => {
  const { id } = request.params;
  const data = request.body;

  const index = rolesStore.findIndex(r => r.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  if (data.name && data.name !== rolesStore[index].name) {
    if (rolesStore.some(r => r.name === data.name && r.id !== id)) {
      throw createMockError(400, { detail: 'Role name already exists' });
    }
  }

  const updatedRole: Role = {
    ...rolesStore[index],
    ...data,
    id,
  };

  rolesStore[index] = updatedRole;
  return updatedRole;
};

/**
 * DELETE /api/v1/roles/:id
 */
export const deleteRoleHandler = (request: any): void => {
  const { id } = request.params;

  const index = rolesStore.findIndex(r => r.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  rolesStore.splice(index, 1);
};

/**
 * GET /api/v1/roles/:id/permissions
 */
export const getRolePermissionsHandler = (request: any): Permission[] => {
  const { id } = request.params;
  const role = rolesStore.find(r => r.id === id);

  if (!role) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  return role.permissions || [];
};

/**
 * POST /api/v1/roles/:id/permissions/:permission_id
 */
export const assignPermissionToRoleHandler = (request: any): Role => {
  const { id, permission_id } = request.params;

  const role = rolesStore.find(r => r.id === id);
  if (!role) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  // Note: We'll add the permission reference once permissions.mock.ts is created
  // For now, just add a placeholder
  if (!role.permissions.some(p => p.id === permission_id)) {
    role.permissions.push({
      id: permission_id,
      name: `permission-${permission_id}`,
      description: null,
    });
  }

  return role;
};

/**
 * Reset roles store
 */
export const resetRolesStore = () => {
  rolesStore = [...mockRoles];
};

/**
 * Export role handlers
 */
export const roleHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/roles',
    handler: getRolesHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/roles/:id',
    handler: getRoleByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/roles',
    handler: createRoleHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/roles/:id',
    handler: updateRoleHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/roles/:id',
    handler: deleteRoleHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/roles/:id/permissions',
    handler: getRolePermissionsHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/roles/:id/permissions/:permission_id',
    handler: assignPermissionToRoleHandler,
  },
];
