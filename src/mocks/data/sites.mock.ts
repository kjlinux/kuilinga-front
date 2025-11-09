/**
 * Sites Mock Data and Handlers
 */

import { Site, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Initial mock sites data
 */
export const mockSites: Site[] = [
  // TechCorp sites (org-1)
  {
    id: 'site-1',
    name: 'TechCorp Paris HQ',
    organization_id: 'org-1',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone_number: '+33 1 23 45 67 89',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'site-2',
    name: 'TechCorp Marseille',
    organization_id: 'org-1',
    address: '56 Rue de la République, 13001 Marseille',
    phone_number: '+33 4 91 12 34 56',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-10-20T09:15:00Z',
  },
  {
    id: 'site-3',
    name: 'TechCorp Lyon',
    organization_id: 'org-1',
    address: '89 Cours Lafayette, 69003 Lyon',
    phone_number: '+33 4 78 23 45 67',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-04-05T09:30:00Z',
    updated_at: '2024-10-25T16:00:00Z',
  },
  {
    id: 'site-4',
    name: 'TechCorp Bordeaux',
    organization_id: 'org-1',
    address: '34 Cours de l\'Intendance, 33000 Bordeaux',
    phone_number: '+33 5 56 34 45 56',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-06-15T08:00:00Z',
    updated_at: '2024-11-03T11:20:00Z',
  },
  {
    id: 'site-5',
    name: 'TechCorp Lille',
    organization_id: 'org-1',
    address: '78 Rue Nationale, 59000 Lille',
    phone_number: '+33 3 20 45 67 89',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-08-20T10:30:00Z',
    updated_at: '2024-10-30T13:45:00Z',
  },

  // InnovateLab sites (org-2)
  {
    id: 'site-6',
    name: 'InnovateLab Lyon Central',
    organization_id: 'org-2',
    address: '45 Rue de la République, 69002 Lyon',
    phone_number: '+33 4 12 34 56 78',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'site-7',
    name: 'InnovateLab Grenoble',
    organization_id: 'org-2',
    address: '12 Rue Félix Poulat, 38000 Grenoble',
    phone_number: '+33 4 76 12 34 56',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2024-10-22T14:00:00Z',
  },
  {
    id: 'site-8',
    name: 'InnovateLab Toulouse',
    organization_id: 'org-2',
    address: '67 Allées Jean Jaurès, 31000 Toulouse',
    phone_number: '+33 5 61 23 45 67',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-07-12T11:30:00Z',
    updated_at: '2024-11-02T10:30:00Z',
  },

  // GlobalServices sites (org-3)
  {
    id: 'site-9',
    name: 'GlobalServices Paris 9e',
    organization_id: 'org-3',
    address: '78 Boulevard Haussmann, 75009 Paris',
    phone_number: '+33 1 34 56 78 90',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'site-10',
    name: 'GlobalServices La Défense',
    organization_id: 'org-3',
    address: '1 Parvis de La Défense, 92800 Puteaux',
    phone_number: '+33 1 45 67 89 01',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-01-20T09:00:00Z',
    updated_at: '2024-10-18T15:30:00Z',
  },
  {
    id: 'site-11',
    name: 'GlobalServices Nantes',
    organization_id: 'org-3',
    address: '23 Rue de Strasbourg, 44000 Nantes',
    phone_number: '+33 2 40 12 34 56',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-03-15T10:30:00Z',
    updated_at: '2024-10-28T12:15:00Z',
  },
  {
    id: 'site-12',
    name: 'GlobalServices Strasbourg',
    organization_id: 'org-3',
    address: '15 Place Kléber, 67000 Strasbourg',
    phone_number: '+33 3 88 23 45 67',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-05-25T08:45:00Z',
    updated_at: '2024-11-01T09:00:00Z',
  },

  // DataTech Solutions sites (org-4)
  {
    id: 'site-13',
    name: 'DataTech Toulouse HQ',
    organization_id: 'org-4',
    address: '12 Rue Victor Hugo, 31000 Toulouse',
    phone_number: '+33 5 67 89 01 23',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-06-05T08:30:00Z',
    updated_at: '2024-10-28T12:00:00Z',
  },
  {
    id: 'site-14',
    name: 'DataTech Montpellier',
    organization_id: 'org-4',
    address: '34 Rue de la Loge, 34000 Montpellier',
    phone_number: '+33 4 67 12 34 56',
    timezone: 'Europe/Paris',
    is_active: true,
    created_at: '2023-08-10T09:00:00Z',
    updated_at: '2024-10-15T14:30:00Z',
  },

  // CloudNet Systems sites (org-5)
  {
    id: 'site-15',
    name: 'CloudNet Nice HQ',
    organization_id: 'org-5',
    address: '90 Promenade des Anglais, 06000 Nice',
    phone_number: '+33 4 23 45 67 89',
    timezone: 'Europe/Paris',
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

  return paginate(filteredSites, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
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

  return site;
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
