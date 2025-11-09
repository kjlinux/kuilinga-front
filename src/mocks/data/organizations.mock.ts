/**
 * Organizations Mock Data and Handlers
 */

import { Organization, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Initial mock organizations data
 */
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'TechCorp',
    description: 'Leading technology company specializing in software development',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone_number: '+33 1 23 45 67 89',
    email: 'contact@techcorp.fr',
    website: 'https://www.techcorp.fr',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'org-2',
    name: 'InnovateLab',
    description: 'Innovation and research laboratory for cutting-edge solutions',
    address: '45 Rue de la République, 69002 Lyon',
    phone_number: '+33 4 12 34 56 78',
    email: 'info@innovatelab.fr',
    website: 'https://www.innovatelab.fr',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'org-3',
    name: 'GlobalServices',
    description: 'International consulting and services provider',
    address: '78 Boulevard Haussmann, 75009 Paris',
    phone_number: '+33 1 34 56 78 90',
    email: 'contact@globalservices.fr',
    website: 'https://www.globalservices.fr',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'org-4',
    name: 'DataTech Solutions',
    description: 'Data analytics and business intelligence company',
    address: '12 Rue Victor Hugo, 31000 Toulouse',
    phone_number: '+33 5 67 89 01 23',
    email: 'hello@datatech.fr',
    website: 'https://www.datatech.fr',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-06-05T08:30:00Z',
    updated_at: '2024-10-28T12:00:00Z',
  },
  {
    id: 'org-5',
    name: 'CloudNet Systems',
    description: 'Cloud infrastructure and networking solutions',
    address: '90 Promenade des Anglais, 06000 Nice',
    phone_number: '+33 4 23 45 67 89',
    email: 'support@cloudnet.fr',
    website: 'https://www.cloudnet.fr',
    timezone: 'Europe/Paris',
    is_active: false,
    created_at: '2023-08-12T07:00:00Z',
    updated_at: '2024-09-20T15:30:00Z',
  },
];

/**
 * In-memory store
 */
let organizationsStore = [...mockOrganizations];

/**
 * GET /api/v1/organizations
 */
export const getOrganizationsHandler = (request: any): PaginatedResponse<Organization> => {
  const { page, page_size, search, is_active } = request.query;

  let filteredOrgs = [...organizationsStore];

  if (search) {
    filteredOrgs = filterBySearch(filteredOrgs, search, ['name', 'description', 'email', 'phone_number']);
  }

  if (is_active !== undefined) {
    filteredOrgs = filteredOrgs.filter(o => o.is_active === (is_active === 'true'));
  }

  return paginate(filteredOrgs, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * GET /api/v1/organizations/:id
 */
export const getOrganizationByIdHandler = (request: any): Organization => {
  const { id } = request.params;
  const org = organizationsStore.find(o => o.id === id);

  if (!org) {
    throw createMockError(404, { detail: 'Organization not found' });
  }

  return org;
};

/**
 * POST /api/v1/organizations
 */
export const createOrganizationHandler = (request: any): Organization => {
  const data = request.body;

  if (!data.name) {
    throw createMockError(422, {
      detail: [{ loc: ['body', 'name'], msg: 'field required', type: 'value_error.missing' }],
    });
  }

  if (organizationsStore.some(o => o.name === data.name)) {
    throw createMockError(400, { detail: 'Organization name already exists' });
  }

  const now = new Date().toISOString();
  const newOrg: Organization = {
    id: randomUUID(),
    name: data.name,
    description: data.description || null,
    address: data.address || null,
    phone_number: data.phone_number || null,
    email: data.email || null,
    website: data.website || null,
    timezone: data.timezone || 'Europe/Paris',
    is_active: data.is_active !== undefined ? data.is_active : true,
    created_at: now,
    updated_at: now,
  };

  organizationsStore.push(newOrg);
  return newOrg;
};

/**
 * PUT /api/v1/organizations/:id
 */
export const updateOrganizationHandler = (request: any): Organization => {
  const { id } = request.params;
  const data = request.body;

  const index = organizationsStore.findIndex(o => o.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Organization not found' });
  }

  if (data.name && data.name !== organizationsStore[index].name) {
    if (organizationsStore.some(o => o.name === data.name && o.id !== id)) {
      throw createMockError(400, { detail: 'Organization name already exists' });
    }
  }

  const updatedOrg: Organization = {
    ...organizationsStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  organizationsStore[index] = updatedOrg;
  return updatedOrg;
};

/**
 * DELETE /api/v1/organizations/:id
 */
export const deleteOrganizationHandler = (request: any): void => {
  const { id } = request.params;

  const index = organizationsStore.findIndex(o => o.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Organization not found' });
  }

  organizationsStore.splice(index, 1);
};

/**
 * Reset organizations store
 */
export const resetOrganizationsStore = () => {
  organizationsStore = [...mockOrganizations];
};

/**
 * Export organization handlers
 */
export const organizationHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/organizations',
    handler: getOrganizationsHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/organizations/:id',
    handler: getOrganizationByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/organizations',
    handler: createOrganizationHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/organizations/:id',
    handler: updateOrganizationHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/organizations/:id',
    handler: deleteOrganizationHandler,
  },
];
