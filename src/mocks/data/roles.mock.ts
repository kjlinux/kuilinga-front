/**
 * Roles Mock Data and Handlers
 */

import { Role, Permission, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Initial mock roles data
 */
export const mockRoles: Role[] = [
  {
    id: 'role-super-admin',
    name: 'super-admin',
    description: 'Super Administrator with full system access',
    permissions: [],
  },
  {
    id: 'role-admin-org',
    name: 'admin-organization',
    description: 'Organization Administrator',
    permissions: [],
  },
  {
    id: 'role-rh',
    name: 'rh',
    description: 'Human Resources Manager',
    permissions: [],
  },
  {
    id: 'role-manager',
    name: 'manager',
    description: 'Team Manager',
    permissions: [],
  },
  {
    id: 'role-employee',
    name: 'employee',
    description: 'Standard Employee',
    permissions: [],
  },
  {
    id: 'role-integrator',
    name: 'integrator',
    description: 'System Integrator',
    permissions: [],
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

  return paginate(filteredRoles, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
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
      resource: 'resource',
      action: 'read',
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
