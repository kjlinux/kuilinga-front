/**
 * Permissions Mock Data and Handlers
 */

import { Permission, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Initial mock permissions data
 */
export const mockPermissions: Permission[] = [
  // User permissions
  { id: 'perm-1', name: 'users:read', description: 'Read users', resource: 'users', action: 'read' },
  { id: 'perm-2', name: 'users:create', description: 'Create users', resource: 'users', action: 'create' },
  { id: 'perm-3', name: 'users:update', description: 'Update users', resource: 'users', action: 'update' },
  { id: 'perm-4', name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },

  // Employee permissions
  { id: 'perm-5', name: 'employees:read', description: 'Read employees', resource: 'employees', action: 'read' },
  { id: 'perm-6', name: 'employees:create', description: 'Create employees', resource: 'employees', action: 'create' },
  { id: 'perm-7', name: 'employees:update', description: 'Update employees', resource: 'employees', action: 'update' },
  { id: 'perm-8', name: 'employees:delete', description: 'Delete employees', resource: 'employees', action: 'delete' },

  // Organization permissions
  { id: 'perm-9', name: 'organizations:read', description: 'Read organizations', resource: 'organizations', action: 'read' },
  { id: 'perm-10', name: 'organizations:create', description: 'Create organizations', resource: 'organizations', action: 'create' },
  { id: 'perm-11', name: 'organizations:update', description: 'Update organizations', resource: 'organizations', action: 'update' },
  { id: 'perm-12', name: 'organizations:delete', description: 'Delete organizations', resource: 'organizations', action: 'delete' },

  // Attendance permissions
  { id: 'perm-13', name: 'attendance:read', description: 'Read attendance', resource: 'attendance', action: 'read' },
  { id: 'perm-14', name: 'attendance:create', description: 'Create attendance', resource: 'attendance', action: 'create' },
  { id: 'perm-15', name: 'attendance:update', description: 'Update attendance', resource: 'attendance', action: 'update' },
  { id: 'perm-16', name: 'attendance:delete', description: 'Delete attendance', resource: 'attendance', action: 'delete' },

  // Device permissions
  { id: 'perm-17', name: 'devices:read', description: 'Read devices', resource: 'devices', action: 'read' },
  { id: 'perm-18', name: 'devices:create', description: 'Create devices', resource: 'devices', action: 'create' },
  { id: 'perm-19', name: 'devices:update', description: 'Update devices', resource: 'devices', action: 'update' },
  { id: 'perm-20', name: 'devices:delete', description: 'Delete devices', resource: 'devices', action: 'delete' },

  // Leave permissions
  { id: 'perm-21', name: 'leaves:read', description: 'Read leaves', resource: 'leaves', action: 'read' },
  { id: 'perm-22', name: 'leaves:create', description: 'Create leaves', resource: 'leaves', action: 'create' },
  { id: 'perm-23', name: 'leaves:approve', description: 'Approve leaves', resource: 'leaves', action: 'approve' },
  { id: 'perm-24', name: 'leaves:reject', description: 'Reject leaves', resource: 'leaves', action: 'reject' },

  // Report permissions
  { id: 'perm-25', name: 'reports:read', description: 'Read reports', resource: 'reports', action: 'read' },
  { id: 'perm-26', name: 'reports:generate', description: 'Generate reports', resource: 'reports', action: 'generate' },
  { id: 'perm-27', name: 'reports:download', description: 'Download reports', resource: 'reports', action: 'download' },

  // Role permissions
  { id: 'perm-28', name: 'roles:read', description: 'Read roles', resource: 'roles', action: 'read' },
  { id: 'perm-29', name: 'roles:create', description: 'Create roles', resource: 'roles', action: 'create' },
  { id: 'perm-30', name: 'roles:update', description: 'Update roles', resource: 'roles', action: 'update' },
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
    filteredPermissions = filterBySearch(filteredPermissions, search, ['name', 'description', 'resource', 'action']);
  }

  return paginate(filteredPermissions, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
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

  if (!data.name || !data.resource || !data.action) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'name, resource, and action are required', type: 'value_error.missing' }],
    });
  }

  if (permissionsStore.some(p => p.name === data.name)) {
    throw createMockError(400, { detail: 'Permission name already exists' });
  }

  const newPermission: Permission = {
    id: randomUUID(),
    name: data.name,
    description: data.description || null,
    resource: data.resource,
    action: data.action,
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
