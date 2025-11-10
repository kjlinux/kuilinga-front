/**
 * Sites Mock Data and Handlers
 */

import { Site, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockOrganizations } from './organizations.mock';
import { mockDepartments } from './departments.mock';
import { mockEmployees } from './employees.mock';
import { mockDevices } from './devices.mock';

/**
 * Initial mock sites data
 */
export const mockSites: Site[] = [
  // Burkina Tech sites (org-1)
  {
    id: 'site-1',
    name: 'Burkina Tech Ouagadougou Siège',
    organization_id: 'org-1',
    address: 'Avenue Kwamé N\'Krumah, Secteur 4, Ouagadougou',
    phone_number: '+226 25 31 45 67',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'site-2',
    name: 'Burkina Tech Bobo-Dioulasso',
    organization_id: 'org-1',
    address: 'Avenue de la Nation, Secteur 7, Bobo-Dioulasso',
    phone_number: '+226 20 97 12 34',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-10-20T09:15:00Z',
  },
  {
    id: 'site-3',
    name: 'Burkina Tech Koudougou',
    organization_id: 'org-1',
    address: 'Rue de la Fraternité, Secteur 3, Koudougou',
    phone_number: '+226 25 44 23 45',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-04-05T09:30:00Z',
    updated_at: '2024-10-25T16:00:00Z',
  },
  {
    id: 'site-4',
    name: 'Burkina Tech Ouahigouya',
    organization_id: 'org-1',
    address: 'Avenue de l\'Indépendance, Secteur 5, Ouahigouya',
    phone_number: '+226 24 55 34 45',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-06-15T08:00:00Z',
    updated_at: '2024-11-03T11:20:00Z',
  },
  {
    id: 'site-5',
    name: 'Burkina Tech Banfora',
    organization_id: 'org-1',
    address: 'Route de Sindou, Secteur 2, Banfora',
    phone_number: '+226 20 91 45 67',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-08-20T10:30:00Z',
    updated_at: '2024-10-30T13:45:00Z',
  },

  // Faso Innovation sites (org-2)
  {
    id: 'site-6',
    name: 'Faso Innovation Bobo-Dioulasso',
    organization_id: 'org-2',
    address: 'Avenue de la Nation, Secteur 15, Bobo-Dioulasso',
    phone_number: '+226 20 97 45 32',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'site-7',
    name: 'Faso Innovation Dédougou',
    organization_id: 'org-2',
    address: 'Route Nationale 14, Secteur 4, Dédougou',
    phone_number: '+226 20 52 12 34',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2024-10-22T14:00:00Z',
  },
  {
    id: 'site-8',
    name: 'Faso Innovation Kaya',
    organization_id: 'org-2',
    address: 'Avenue Thomas Sankara, Secteur 2, Kaya',
    phone_number: '+226 24 45 23 45',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-07-12T11:30:00Z',
    updated_at: '2024-11-02T10:30:00Z',
  },

  // Sahel Services sites (org-3)
  {
    id: 'site-9',
    name: 'Sahel Services Ouagadougou',
    organization_id: 'org-3',
    address: 'Boulevard Charles De Gaulle, Secteur 12, Ouagadougou',
    phone_number: '+226 25 36 78 90',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'site-10',
    name: 'Sahel Services Ziniaré',
    organization_id: 'org-3',
    address: 'Route de Ouagadougou, Secteur 1, Ziniaré',
    phone_number: '+226 25 30 67 89',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-01-20T09:00:00Z',
    updated_at: '2024-10-18T15:30:00Z',
  },
  {
    id: 'site-11',
    name: 'Sahel Services Tenkodogo',
    organization_id: 'org-3',
    address: 'Avenue de la Liberté, Secteur 3, Tenkodogo',
    phone_number: '+226 40 71 12 34',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-03-15T10:30:00Z',
    updated_at: '2024-10-28T12:15:00Z',
  },
  {
    id: 'site-12',
    name: 'Sahel Services Fada N\'Gourma',
    organization_id: 'org-3',
    address: 'Rue du Commerce, Secteur 2, Fada N\'Gourma',
    phone_number: '+226 40 77 23 45',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-05-25T08:45:00Z',
    updated_at: '2024-11-01T09:00:00Z',
  },

  // DataFaso Solutions sites (org-4)
  {
    id: 'site-13',
    name: 'DataFaso Koudougou Siège',
    organization_id: 'org-4',
    address: 'Rue de la Révolution, Secteur 7, Koudougou',
    phone_number: '+226 25 44 67 89',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-06-05T08:30:00Z',
    updated_at: '2024-10-28T12:00:00Z',
  },
  {
    id: 'site-14',
    name: 'DataFaso Réo',
    organization_id: 'org-4',
    address: 'Avenue Principale, Secteur 1, Réo',
    phone_number: '+226 25 46 12 34',
    timezone: 'Africa/Ouagadougou',
    is_active: true,
    created_at: '2023-08-10T09:00:00Z',
    updated_at: '2024-10-15T14:30:00Z',
  },

  // Moaga Digital sites (org-5)
  {
    id: 'site-15',
    name: 'Moaga Digital Ouahigouya',
    organization_id: 'org-5',
    address: 'Avenue de l\'Indépendance, Secteur 8, Ouahigouya',
    phone_number: '+226 24 55 67 89',
    timezone: 'Africa/Ouagadougou',
    is_active: false,
    created_at: '2023-08-12T07:00:00Z',
    updated_at: '2024-09-20T15:30:00Z',
  },
];

/**
 * In-memory store
 */
let sitesStore = [...mockSites];

/**
 * Enrich site with related entities
 */
const enrichSite = (site: Site): any => {
  const organization = mockOrganizations.find(o => o.id === site.organization_id);
  const departments = mockDepartments.filter(d => d.site_id === site.id);
  const departmentIds = departments.map(d => d.id);
  const employees = mockEmployees.filter(e => e.department_id && departmentIds.includes(e.department_id));
  const devices = mockDevices.filter(d => d.site_id === site.id);

  return {
    ...site,
    organization: organization ? {
      id: organization.id,
      name: organization.name,
    } : null,
    departments_count: departments.length,
    employees_count: employees.length,
    devices_count: devices.length,
  };
};

/**
 * GET /api/v1/sites
 */
export const getSitesHandler = (request: any): PaginatedResponse<Site> => {
  const { page, page_size, search, organization_id, is_active } = request.query;

  let filteredSites = [...sitesStore];

  if (search) {
    filteredSites = filterBySearch(filteredSites, search, ['name', 'address', 'phone_number']);
  }

  if (organization_id) {
    filteredSites = filteredSites.filter(s => s.organization_id === organization_id);
  }

  if (is_active !== undefined) {
    filteredSites = filteredSites.filter(s => s.is_active === (is_active === 'true'));
  }

  const enrichedSites = filteredSites.map(enrichSite);

  return paginate(enrichedSites, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * GET /api/v1/sites/:id
 */
export const getSiteByIdHandler = (request: any): Site => {
  const { id } = request.params;
  const site = sitesStore.find(s => s.id === id);

  if (!site) {
    throw createMockError(404, { detail: 'Site not found' });
  }

  return enrichSite(site);
};

/**
 * POST /api/v1/sites
 */
export const createSiteHandler = (request: any): Site => {
  const data = request.body;

  if (!data.name || !data.organization_id) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'name and organization_id are required', type: 'value_error.missing' }],
    });
  }

  const now = new Date().toISOString();
  const newSite: Site = {
    id: randomUUID(),
    name: data.name,
    organization_id: data.organization_id,
    address: data.address || null,
    phone_number: data.phone_number || null,
    timezone: data.timezone || 'Europe/Paris',
    is_active: data.is_active !== undefined ? data.is_active : true,
    created_at: now,
    updated_at: now,
  };

  sitesStore.push(newSite);
  return newSite;
};

/**
 * PUT /api/v1/sites/:id
 */
export const updateSiteHandler = (request: any): Site => {
  const { id } = request.params;
  const data = request.body;

  const index = sitesStore.findIndex(s => s.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Site not found' });
  }

  const updatedSite: Site = {
    ...sitesStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  sitesStore[index] = updatedSite;
  return updatedSite;
};

/**
 * DELETE /api/v1/sites/:id
 */
export const deleteSiteHandler = (request: any): void => {
  const { id } = request.params;

  const index = sitesStore.findIndex(s => s.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Site not found' });
  }

  sitesStore.splice(index, 1);
};

/**
 * Reset sites store
 */
export const resetSitesStore = () => {
  sitesStore = [...mockSites];
};

/**
 * Export site handlers
 */
export const siteHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/sites',
    handler: getSitesHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/sites/:id',
    handler: getSiteByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/sites',
    handler: createSiteHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/sites/:id',
    handler: updateSiteHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/sites/:id',
    handler: deleteSiteHandler,
  },
];
