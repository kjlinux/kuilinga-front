/**
 * Users Mock Data and Handlers
 *
 * Handles user-related mock endpoints
 */

import { User, Role, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockRoles } from './roles.mock';

/**
 * Helper to get role by ID from mockRoles
 */
const getRoleById = (roleId: string): Role => {
  const role = mockRoles.find(r => r.id === roleId);
  if (!role) {
    throw new Error(`Role with id ${roleId} not found`);
  }
  return role;
};

/**
 * Initial mock users data with roles that have permissions
 */
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@kuilinga.com',
    full_name: 'Super Admin',
    phone_number: '+226 70 12 34 56',
    organization_id: null,
    is_active: true,
    is_superuser: true,
    roles: [getRoleById('role-super-admin')],
  },
  {
    id: '2',
    email: 'admin@kuilinga.com',
    full_name: 'Abdoulaye Ouédraogo',
    phone_number: '+226 70 23 45 67',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-admin-org')],
  },
  {
    id: '3',
    email: 'rh@kuilinga.com',
    full_name: 'Fatoumata Sawadogo',
    phone_number: '+226 70 34 56 78',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-rh')],
  },
  {
    id: '4',
    email: 'manager@kuilinga.com',
    full_name: 'Ousmane Compaoré',
    phone_number: '+226 70 45 67 89',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-manager')],
  },
  {
    id: '5',
    email: 'employee@kuilinga.com',
    full_name: 'Aminata Traoré',
    phone_number: '+226 70 56 78 90',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-employee')],
  },
  {
    id: '6',
    email: 'mariam.kone@kuilinga.com',
    full_name: 'Mariam Koné',
    phone_number: '+226 70 67 89 01',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-manager')],
  },
  {
    id: '7',
    email: 'amadou.sorgho@kuilinga.com',
    full_name: 'Amadou Sorgho',
    phone_number: '+226 70 78 90 12',
    organization_id: 'org-2',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-admin-org')],
  },
  {
    id: '8',
    email: 'safiatou.nikiema@kuilinga.com',
    full_name: 'Safiatou Nikiema',
    phone_number: '+226 70 89 01 23',
    organization_id: 'org-2',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-rh')],
  },
  {
    id: '9',
    email: 'boubacar.diallo@kuilinga.com',
    full_name: 'Boubacar Diallo',
    phone_number: '+226 70 90 12 34',
    organization_id: 'org-3',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-employee')],
  },
  {
    id: '10',
    email: 'salamata.ouattara@kuilinga.com',
    full_name: 'Salamata Ouattara',
    phone_number: '+226 71 01 23 45',
    organization_id: 'org-3',
    is_active: true,
    is_superuser: false,
    roles: [getRoleById('role-manager')],
  },
];

/**
 * In-memory store (mutable for CRUD operations)
 */
let usersStore = [...mockUsers];

/**
 * GET /api/v1/users
 */
export const getUsersHandler = (request: any): PaginatedResponse<User> => {
  const { page, page_size, search } = request.query;

  let filteredUsers = [...usersStore];

  // Apply search filter
  if (search) {
    filteredUsers = filterBySearch(filteredUsers, search, ['email', 'full_name', 'phone_number']);
  }

  // Filter by organization_id if provided
  if (request.query.organization_id) {
    filteredUsers = filteredUsers.filter(u => u.organization_id === request.query.organization_id);
  }

  // Paginate
  return paginate(filteredUsers, pageToSkipLimit(page, page_size));
};

/**
 * GET /api/v1/users/:id
 */
export const getUserByIdHandler = (request: any): User => {
  const { id } = request.params;
  const user = usersStore.find(u => u.id === id);

  if (!user) {
    throw createMockError(404, { detail: 'User not found' });
  }

  return user;
};

/**
 * POST /api/v1/users
 */
export const createUserHandler = (request: any): User => {
  const data = request.body;

  // Validate required fields
  if (!data.email) {
    throw createMockError(422, {
      detail: [{ loc: ['body', 'email'], msg: 'field required', type: 'value_error.missing' }],
    });
  }

  // Check if email already exists
  if (usersStore.some(u => u.email === data.email)) {
    throw createMockError(400, { detail: 'Email already registered' });
  }

  const newUser: User = {
    id: randomUUID(),
    email: data.email,
    full_name: data.full_name || null,
    phone_number: data.phone_number || null,
    organization_id: data.organization_id || null,
    is_active: data.is_active !== undefined ? data.is_active : true,
    is_superuser: data.is_superuser || false,
    roles: data.roles || [],
  };

  usersStore.push(newUser);
  return newUser;
};

/**
 * PUT /api/v1/users/:id
 */
export const updateUserHandler = (request: any): User => {
  const { id } = request.params;
  const data = request.body;

  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'User not found' });
  }

  // Check email uniqueness if changed
  if (data.email && data.email !== usersStore[index].email) {
    if (usersStore.some(u => u.email === data.email && u.id !== id)) {
      throw createMockError(400, { detail: 'Email already registered' });
    }
  }

  const updatedUser: User = {
    ...usersStore[index],
    ...data,
    id, // Keep original ID
  };

  usersStore[index] = updatedUser;
  return updatedUser;
};

/**
 * DELETE /api/v1/users/:id
 */
export const deleteUserHandler = (request: any): void => {
  const { id } = request.params;

  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'User not found' });
  }

  usersStore.splice(index, 1);
};

/**
 * POST /api/v1/users/:id/roles/:role_id
 */
export const assignRoleToUserHandler = (request: any): User => {
  const { id, role_id } = request.params;

  const user = usersStore.find(u => u.id === id);
  if (!user) {
    throw createMockError(404, { detail: 'User not found' });
  }

  // Find role in mock roles
  const role = mockRoles.find(r => r.id === role_id);
  if (!role) {
    throw createMockError(404, { detail: 'Role not found' });
  }

  // Check if role already assigned
  if (!user.roles.some(r => r.id === role_id)) {
    user.roles.push(role);
  }

  return user;
};

/**
 * Reset users store to initial data (useful for testing)
 */
export const resetUsersStore = () => {
  usersStore = [...mockUsers];
};

/**
 * Export user handlers
 */
export const userHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/users',
    handler: getUsersHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/users/:id',
    handler: getUserByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/users',
    handler: createUserHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/users/:id',
    handler: updateUserHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/users/:id',
    handler: deleteUserHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/users/:id/roles/:role_id',
    handler: assignRoleToUserHandler,
  },
];
