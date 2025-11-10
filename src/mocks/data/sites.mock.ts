/**
 * Sites Mock Data and Handlers
 */

import { Site, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Internal site structure (flat for easier management)
 */
interface SiteInternal {
  id: string;
  name: string;
  organization_id: string;
  address?: string | null;
  timezone: string;
}

/**
 * Initial mock sites data (internal structure)
 */
const mockSitesInternal: SiteInternal[] = [
  // Burkina Tech sites (org-1)
  {
    id: 'site-1',
    name: 'Burkina Tech Ouagadougou Siège',
    organization_id: 'org-1',
    address: 'Avenue Kwamé N\'Krumah, Secteur 4, Ouagadougou',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-2',
    name: 'Burkina Tech Bobo-Dioulasso',
    organization_id: 'org-1',
    address: 'Avenue de la Nation, Secteur 7, Bobo-Dioulasso',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-3',
    name: 'Burkina Tech Koudougou',
    organization_id: 'org-1',
    address: 'Rue de la Fraternité, Secteur 3, Koudougou',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-4',
    name: 'Burkina Tech Ouahigouya',
    organization_id: 'org-1',
    address: 'Avenue de l\'Indépendance, Secteur 5, Ouahigouya',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-5',
    name: 'Burkina Tech Banfora',
    organization_id: 'org-1',
    address: 'Route de Sindou, Secteur 2, Banfora',
    timezone: 'Africa/Ouagadougou',
  },

  // Faso Innovation sites (org-2)
  {
    id: 'site-6',
    name: 'Faso Innovation Bobo-Dioulasso',
    organization_id: 'org-2',
    address: 'Avenue de la Nation, Secteur 15, Bobo-Dioulasso',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-7',
    name: 'Faso Innovation Dédougou',
    organization_id: 'org-2',
    address: 'Route Nationale 14, Secteur 4, Dédougou',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-8',
    name: 'Faso Innovation Kaya',
    organization_id: 'org-2',
    address: 'Avenue Thomas Sankara, Secteur 2, Kaya',
    timezone: 'Africa/Ouagadougou',
  },

  // Sahel Services sites (org-3)
  {
    id: 'site-9',
    name: 'Sahel Services Ouagadougou',
    organization_id: 'org-3',
    address: 'Boulevard Charles De Gaulle, Secteur 12, Ouagadougou',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-10',
    name: 'Sahel Services Ziniaré',
    organization_id: 'org-3',
    address: 'Route de Ouagadougou, Secteur 1, Ziniaré',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-11',
    name: 'Sahel Services Tenkodogo',
    organization_id: 'org-3',
    address: 'Avenue de la Liberté, Secteur 3, Tenkodogo',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-12',
    name: 'Sahel Services Fada N\'Gourma',
    organization_id: 'org-3',
    address: 'Rue du Commerce, Secteur 2, Fada N\'Gourma',
    timezone: 'Africa/Ouagadougou',
  },

  // DataFaso Solutions sites (org-4)
  {
    id: 'site-13',
    name: 'DataFaso Koudougou Siège',
    organization_id: 'org-4',
    address: 'Rue de la Révolution, Secteur 7, Koudougou',
    timezone: 'Africa/Ouagadougou',
  },
  {
    id: 'site-14',
    name: 'DataFaso Réo',
    organization_id: 'org-4',
    address: 'Avenue Principale, Secteur 1, Réo',
    timezone: 'Africa/Ouagadougou',
  },

  // Moaga Digital sites (org-5)
  {
    id: 'site-15',
    name: 'Moaga Digital Ouahigouya',
    organization_id: 'org-5',
    address: 'Avenue de l\'Indépendance, Secteur 8, Ouahigouya',
    timezone: 'Africa/Ouagadougou',
  },
];

/**
 * Export internal sites for other mocks to import
 */
export const mockSites = mockSitesInternal;

/**
 * In-memory store
 */
let sitesStore = [...mockSitesInternal];

/**
 * Enrich site with related entities
 */
const enrichSite = (site: SiteInternal): Site => {
  // Lazy imports to avoid circular dependencies
  const { mockOrganizations } = require('./organizations.mock');
  const { mockDepartments } = require('./departments.mock');
  const { mockEmployees } = require('./employees.mock');
  const { mockDevices } = require('./devices.mock');

  const organization = mockOrganizations.find((o: any) => o.id === site.organization_id);
  const departments = mockDepartments.filter((d: any) => d.site_id === site.id);
  const departmentIds = departments.map((d: any) => d.id);
  const employees = mockEmployees.filter((e: any) => e.department_id && departmentIds.includes(e.department_id));
  const devices = mockDevices.filter((d: any) => d.site_id === site.id);

  return {
    id: site.id,
    name: site.name,
    address: site.address || null,
    timezone: site.timezone,
    organization: organization ? {
      id: organization.id,
      name: organization.name,
      description: organization.description || null,
      email: organization.email || null,
      phone: organization.phone || null,
      timezone: organization.timezone,
      plan: organization.plan || null,
      is_active: organization.is_active,
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
  const { page, page_size, search, organization_id } = request.query;

  let filteredSites = [...sitesStore];

  if (search) {
    filteredSites = filterBySearch(filteredSites, search, ['name', 'address']);
  }

  if (organization_id) {
    filteredSites = filteredSites.filter(s => s.organization_id === organization_id);
  }

  const enrichedSites = filteredSites.map(enrichSite);

  return paginate(enrichedSites, pageToSkipLimit(page, page_size));
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

  const newSite: SiteInternal = {
    id: randomUUID(),
    name: data.name,
    organization_id: data.organization_id,
    address: data.address || null,
    timezone: data.timezone || 'Africa/Ouagadougou',
  };

  sitesStore.push(newSite);
  return enrichSite(newSite);
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

  const updatedSite: SiteInternal = {
    ...sitesStore[index],
    name: data.name !== undefined ? data.name : sitesStore[index].name,
    organization_id: data.organization_id !== undefined ? data.organization_id : sitesStore[index].organization_id,
    address: data.address !== undefined ? data.address : sitesStore[index].address,
    timezone: data.timezone !== undefined ? data.timezone : sitesStore[index].timezone,
    id,
  };

  sitesStore[index] = updatedSite;
  return enrichSite(updatedSite);
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
  sitesStore = [...mockSitesInternal];
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
