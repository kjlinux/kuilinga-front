/**
 * Organizations Mock Data and Handlers
 */

import { Organization, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Internal organization structure (flat for easier management)
 */
interface OrganizationInternal {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  timezone: string;
  plan?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Initial mock organizations data (internal structure)
 */
const mockOrganizationsInternal: OrganizationInternal[] = [
  {
    id: 'org-1',
    name: 'Burkina Tech',
    description: 'Entreprise leader en développement de solutions logicielles',
    address: 'Avenue Kwamé N\'Krumah, Secteur 4, Ouagadougou',
    phone: '+226 25 31 45 67',
    email: 'contact@burkinatech.bf',
    website: 'https://www.burkinatech.bf',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'org-2',
    name: 'Faso Innovation',
    description: 'Laboratoire d\'innovation et de recherche pour des solutions de pointe',
    address: 'Avenue de la Nation, Secteur 15, Bobo-Dioulasso',
    phone: '+226 20 97 45 32',
    email: 'info@fasoinnovation.bf',
    website: 'https://www.fasoinnovation.bf',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'org-3',
    name: 'Sahel Services',
    description: 'Prestataire de services de conseil international',
    address: 'Boulevard Charles De Gaulle, Secteur 12, Ouagadougou',
    phone: '+226 25 36 78 90',
    email: 'contact@sahelservices.bf',
    website: 'https://www.sahelservices.bf',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'org-4',
    name: 'DataFaso Solutions',
    description: 'Entreprise d\'analyse de données et d\'intelligence d\'affaires',
    address: 'Rue de la Révolution, Secteur 7, Koudougou',
    phone: '+226 25 44 67 89',
    email: 'hello@datafaso.bf',
    website: 'https://www.datafaso.bf',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-06-05T08:30:00Z',
    updated_at: '2024-10-28T12:00:00Z',
  },
  {
    id: 'org-5',
    name: 'Moaga Digital',
    description: 'Solutions d\'infrastructure cloud et de réseautage',
    address: 'Avenue de l\'Indépendance, Secteur 8, Ouahigouya',
    phone: '+226 24 55 67 89',
    email: 'support@moagadigital.bf',
    website: 'https://www.moagadigital.bf',
    timezone: 'Africa/Ouagadougou',
    is_active: false,
    created_at: '2023-08-12T07:00:00Z',
    updated_at: '2024-09-20T15:30:00Z',
  },
];

/**
 * In-memory store
 */
let organizationsStore = [...mockOrganizationsInternal];

/**
 * Enrich organization with counts (to match Organization type)
 */
const enrichOrganization = (org: OrganizationInternal): Organization => {
  // Lazy import to avoid circular dependencies
  let sites_count = 0;
  let employees_count = 0;
  let users_count = 0;

  try {
    const { mockSites } = require('./sites.mock');
    const sites = mockSites.filter((s: any) => s.organization_id === org.id);
    sites_count = sites.length;

    // Count employees through departments and sites
    try {
      const { mockDepartments } = require('./departments.mock');
      const siteIds = sites.map((s: any) => s.id);
      const departments = mockDepartments.filter((d: any) => siteIds.includes(d.site_id));
      const departmentIds = departments.map((d: any) => d.id);

      const { mockEmployees } = require('./employees.mock');
      employees_count = mockEmployees.filter((e: any) => e.department_id && departmentIds.includes(e.department_id)).length;
    } catch (e) {
      employees_count = 0;
    }

    // Count users
    try {
      const { mockUsers } = require('./users.mock');
      users_count = mockUsers.filter((u: any) => u.organization_id === org.id).length;
    } catch (e) {
      users_count = 0;
    }
  } catch (e) {
    sites_count = 0;
  }

  // Determine plan based on organization
  let plan = 'Basic';
  if (org.id === 'org-1' || org.id === 'org-3') {
    plan = 'Enterprise';
  } else if (org.id === 'org-2' || org.id === 'org-4') {
    plan = 'Professional';
  }

  return {
    id: org.id,
    name: org.name,
    description: org.description || null,
    email: org.email || null,
    phone: org.phone || null,
    timezone: org.timezone,
    plan,
    is_active: org.is_active,
    sites_count,
    employees_count,
    users_count,
  };
};

/**
 * GET /api/v1/organizations
 */
export const getOrganizationsHandler = (request: any): PaginatedResponse<Organization> => {
  const { page, page_size, search, is_active } = request.query;

  let filteredOrgs = [...organizationsStore];

  if (search) {
    filteredOrgs = filterBySearch(filteredOrgs, search, ['name', 'description', 'email', 'phone']);
  }

  if (is_active !== undefined) {
    filteredOrgs = filteredOrgs.filter(o => o.is_active === (is_active === 'true'));
  }

  const enrichedOrgs = filteredOrgs.map(enrichOrganization);

  return paginate(enrichedOrgs, pageToSkipLimit(page, page_size));
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

  return enrichOrganization(org);
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
  const newOrg: OrganizationInternal = {
    id: randomUUID(),
    name: data.name,
    description: data.description || null,
    address: data.address || null,
    phone: data.phone || null,
    email: data.email || null,
    website: data.website || null,
    timezone: data.timezone || 'Europe/Paris',
    is_active: data.is_active !== undefined ? data.is_active : true,
    created_at: now,
    updated_at: now,
  };

  organizationsStore.push(newOrg);
  return enrichOrganization(newOrg);
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

  const updatedOrg: OrganizationInternal = {
    ...organizationsStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  organizationsStore[index] = updatedOrg;
  return enrichOrganization(updatedOrg);
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
  organizationsStore = [...mockOrganizationsInternal];
};

/**
 * Export enriched organizations for use in other mocks
 */
export const mockOrganizations = mockOrganizationsInternal;

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
