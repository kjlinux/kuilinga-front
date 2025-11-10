/**
 * Permissions Mock Data and Handlers
 */

import { Permission, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Initial mock permissions data
 */
export const mockPermissions: Permission[] = [
  // User permissions
  { id: 'perm-1', name: 'users:read', description: 'Read users' },
  { id: 'perm-2', name: 'users:create', description: 'Create users' },
  { id: 'perm-3', name: 'users:update', description: 'Update users' },
  { id: 'perm-4', name: 'users:delete', description: 'Delete users' },

  // Employee permissions
  { id: 'perm-5', name: 'employees:read', description: 'Read employees' },
  { id: 'perm-6', name: 'employees:create', description: 'Create employees' },
  { id: 'perm-7', name: 'employees:update', description: 'Update employees' },
  { id: 'perm-8', name: 'employees:delete', description: 'Delete employees' },

  // Organization permissions
  { id: 'perm-9', name: 'organizations:read', description: 'Read organizations' },
  { id: 'perm-10', name: 'organizations:create', description: 'Create organizations' },
  { id: 'perm-11', name: 'organizations:update', description: 'Update organizations' },
  { id: 'perm-12', name: 'organizations:delete', description: 'Delete organizations' },

  // Attendance permissions
  { id: 'perm-13', name: 'attendance:read', description: 'Read attendance' },
  { id: 'perm-14', name: 'attendance:create', description: 'Create attendance' },
  { id: 'perm-15', name: 'attendance:update', description: 'Update attendance' },
  { id: 'perm-16', name: 'attendance:delete', description: 'Delete attendance' },

  // Device permissions
  { id: 'perm-17', name: 'devices:read', description: 'Read devices' },
  { id: 'perm-18', name: 'devices:create', description: 'Create devices' },
  { id: 'perm-19', name: 'devices:update', description: 'Update devices' },
  { id: 'perm-20', name: 'devices:delete', description: 'Delete devices' },

  // Leave permissions
  { id: 'perm-21', name: 'leaves:read', description: 'Read leaves' },
  { id: 'perm-22', name: 'leaves:create', description: 'Create leaves' },
  { id: 'perm-23', name: 'leaves:approve', description: 'Approve leaves' },
  { id: 'perm-24', name: 'leaves:reject', description: 'Reject leaves' },

  // Report permissions
  { id: 'perm-25', name: 'reports:read', description: 'Read reports' },
  { id: 'perm-26', name: 'reports:generate', description: 'Generate reports' },
  { id: 'perm-27', name: 'reports:download', description: 'Download reports' },

  // Role permissions
  { id: 'perm-28', name: 'roles:read', description: 'Read roles' },
  { id: 'perm-29', name: 'roles:create', description: 'Create roles' },
  { id: 'perm-30', name: 'roles:update', description: 'Update roles' },
];

/**
 * In-memory store
 */
let permissionsStore = [...mockPermissions];

/**
 * GET /api/v1/permissions
 */
export const getPermissionsHandler = (request: any): PaginatedResponse<Permission> => {
  const { page, page_size, search } = request.query;

  let filteredPermissions = [...permissionsStore];

  if (search) {
    filteredPermissions = filterBySearch(filteredPermissions, search, ['name', 'description']);
  }

  return paginate(filteredPermissions, pageToSkipLimit(page, page_size));
};

/**
 * GET /api/v1/permissions/:id
 */
export const getPermissionByIdHandler = (request: any): Permission => {
  const { id } = request.params;
  const permission = permissionsStore.find(p => p.id === id);

  if (!permission) {
    throw createMockError(404, { detail: 'Permission not found' });
  }

  return permission;
};

/**
 * POST /api/v1/permissions
 */
export const createPermissionHandler = (request: any): Permission => {
  const data = request.body;

  if (!data.name) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'name is required', type: 'value_error.missing' }],
    });
  }

  if (permissionsStore.some(p => p.name === data.name)) {
    throw createMockError(400, { detail: 'Permission name already exists' });
  }

  const newPermission: Permission = {
    id: randomUUID(),
    name: data.name,
    description: data.description || null,
  };

  permissionsStore.push(newPermission);
  return newPermission;
};

/**
 * PUT /api/v1/permissions/:id
 */
export const updatePermissionHandler = (request: any): Permission => {
  const { id } = request.params;
  const data = request.body;

  const index = permissionsStore.findIndex(p => p.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Permission not found' });
  }

  const updatedPermission: Permission = {
    ...permissionsStore[index],
    ...data,
    id,
  };

  permissionsStore[index] = updatedPermission;
  return updatedPermission;
};

/**
 * DELETE /api/v1/permissions/:id
 */
export const deletePermissionHandler = (request: any): void => {
  const { id } = request.params;

  const index = permissionsStore.findIndex(p => p.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Permission not found' });
  }

  permissionsStore.splice(index, 1);
};

/**
 * Reset permissions store
 */
export const resetPermissionsStore = () => {
  permissionsStore = [...mockPermissions];
};

/**
 * Export permission handlers
 */
export const permissionHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/permissions',
    handler: getPermissionsHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/permissions/:id',
    handler: getPermissionByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/permissions',
    handler: createPermissionHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/permissions/:id',
    handler: updatePermissionHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/permissions/:id',
    handler: deletePermissionHandler,
  },
];
