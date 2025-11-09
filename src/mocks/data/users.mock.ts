/**
 * Users Mock Data and Handlers
 *
 * Handles user-related mock endpoints
 */

import { User, Role, Permission, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockRoles } from './roles.mock';

/**
 * Initial mock users data
 */
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@kuilinga.com',
    full_name: 'Super Admin',
    phone_number: '+33 6 12 34 56 78',
    organization_id: null,
    is_active: true,
    is_superuser: true,
    roles: [
      {
        id: 'role-super-admin',
        name: 'super-admin',
        description: 'Super Administrator with full system access',
        permissions: [],
      },
    ],
  },
  {
    id: '2',
    email: 'admin@kuilinga.com',
    full_name: 'Admin Organization',
    phone_number: '+33 6 23 45 67 89',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-admin-org',
        name: 'admin-organization',
        description: 'Organization Administrator',
        permissions: [],
      },
    ],
  },
  {
    id: '3',
    email: 'rh@kuilinga.com',
    full_name: 'Responsable RH',
    phone_number: '+33 6 34 56 78 90',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-rh',
        name: 'rh',
        description: 'Human Resources',
        permissions: [],
      },
    ],
  },
  {
    id: '4',
    email: 'manager@kuilinga.com',
    full_name: 'Manager Équipe',
    phone_number: '+33 6 45 67 89 01',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-manager',
        name: 'manager',
        description: 'Team Manager',
        permissions: [],
      },
    ],
  },
  {
    id: '5',
    email: 'employee@kuilinga.com',
    full_name: 'Employé Standard',
    phone_number: '+33 6 56 78 90 12',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-employee',
        name: 'employee',
        description: 'Standard Employee',
        permissions: [],
      },
    ],
  },
  {
    id: '6',
    email: 'marie.dubois@kuilinga.com',
    full_name: 'Marie Dubois',
    phone_number: '+33 6 67 89 01 23',
    organization_id: 'org-1',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-manager',
        name: 'manager',
        description: 'Team Manager',
        permissions: [],
      },
    ],
  },
  {
    id: '7',
    email: 'thomas.martin@kuilinga.com',
    full_name: 'Thomas Martin',
    phone_number: '+33 6 78 90 12 34',
    organization_id: 'org-2',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-admin-org',
        name: 'admin-organization',
        description: 'Organization Administrator',
        permissions: [],
      },
    ],
  },
  {
    id: '8',
    email: 'sophie.bernard@kuilinga.com',
    full_name: 'Sophie Bernard',
    phone_number: '+33 6 89 01 23 45',
    organization_id: 'org-2',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-rh',
        name: 'rh',
        description: 'Human Resources',
        permissions: [],
      },
    ],
  },
  {
    id: '9',
    email: 'lucas.petit@kuilinga.com',
    full_name: 'Lucas Petit',
    phone_number: '+33 6 90 12 34 56',
    organization_id: 'org-3',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-employee',
        name: 'employee',
        description: 'Standard Employee',
        permissions: [],
      },
    ],
  },
  {
    id: '10',
    email: 'emma.laurent@kuilinga.com',
    full_name: 'Emma Laurent',
    phone_number: '+33 7 01 23 45 67',
    organization_id: 'org-3',
    is_active: true,
    is_superuser: false,
    roles: [
      {
        id: 'role-manager',
        name: 'manager',
        description: 'Team Manager',
        permissions: [],
      },
    ],
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
  return paginate(filteredUsers, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
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
