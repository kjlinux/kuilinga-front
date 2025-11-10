/**
 * Devices Mock Data and Handlers
 */

import { Device, DeviceStatus, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID, randomElement } from '../utils/generators';
import { mockSites } from './sites.mock';
import { mockOrganizations } from './organizations.mock';

/**
 * Initial mock devices data
 */
export const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Lecteur Biométrique Paris HQ - Entrée',
    serial_number: 'BIO-2023-001',
    model: 'BioPro X500',
    site_id: 'site-1',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:30:00Z',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-09T08:30:00Z',
  },
  {
    id: 'device-2',
    name: 'Lecteur Biométrique Paris HQ - Sortie',
    serial_number: 'BIO-2023-002',
    model: 'BioPro X500',
    site_id: 'site-1',
    location: 'Sortie principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:32:00Z',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-09T08:32:00Z',
  },
  {
    id: 'device-3',
    name: 'Badge Reader Paris - R&D',
    serial_number: 'BADGE-2023-001',
    model: 'AccessCard Pro',
    site_id: 'site-1',
    location: 'Département R&D',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:25:00Z',
    created_at: '2023-02-01T10:00:00Z',
    updated_at: '2024-11-09T08:25:00Z',
  },
  {
    id: 'device-4',
    name: 'Lecteur Biométrique Marseille - Entrée',
    serial_number: 'BIO-2023-003',
    model: 'BioPro X500',
    site_id: 'site-2',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:20:00Z',
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-11-09T08:20:00Z',
  },
  {
    id: 'device-5',
    name: 'Lecteur Biométrique Marseille - Sortie',
    serial_number: 'BIO-2023-004',
    model: 'BioPro X500',
    site_id: 'site-2',
    location: 'Sortie principale',
    status: DeviceStatus.Offline,
    last_sync: '2024-11-08T17:45:00Z',
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-11-08T17:45:00Z',
  },
  {
    id: 'device-6',
    name: 'Lecteur Biométrique Lyon - Entrée',
    serial_number: 'BIO-2023-005',
    model: 'BioPro X600',
    site_id: 'site-3',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:28:00Z',
    created_at: '2023-04-05T09:30:00Z',
    updated_at: '2024-11-09T08:28:00Z',
  },
  {
    id: 'device-7',
    name: 'Lecteur Biométrique Bordeaux - Entrée',
    serial_number: 'BIO-2023-006',
    model: 'BioPro X600',
    site_id: 'site-4',
    location: 'Entrée principale',
    status: DeviceStatus.Maintenance,
    last_sync: '2024-11-07T14:00:00Z',
    created_at: '2023-06-15T08:00:00Z',
    updated_at: '2024-11-07T14:00:00Z',
  },
  {
    id: 'device-8',
    name: 'Lecteur Biométrique Lille - Entrée',
    serial_number: 'BIO-2023-007',
    model: 'BioPro X600',
    site_id: 'site-5',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:15:00Z',
    created_at: '2023-08-20T10:30:00Z',
    updated_at: '2024-11-09T08:15:00Z',
  },
  {
    id: 'device-9',
    name: 'Badge Reader InnovateLab Lyon',
    serial_number: 'BADGE-2023-002',
    model: 'AccessCard Elite',
    site_id: 'site-6',
    location: 'Laboratoire principal',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:35:00Z',
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-11-09T08:35:00Z',
  },
  {
    id: 'device-10',
    name: 'Lecteur Biométrique Grenoble',
    serial_number: 'BIO-2023-008',
    model: 'BioPro X700',
    site_id: 'site-7',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:18:00Z',
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2024-11-09T08:18:00Z',
  },
  {
    id: 'device-11',
    name: 'Lecteur Biométrique Toulouse InnovateLab',
    serial_number: 'BIO-2023-009',
    model: 'BioPro X700',
    site_id: 'site-8',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:22:00Z',
    created_at: '2023-07-12T11:30:00Z',
    updated_at: '2024-11-09T08:22:00Z',
  },
  {
    id: 'device-12',
    name: 'Badge Reader GlobalServices Paris',
    serial_number: 'BADGE-2023-003',
    model: 'AccessCard Pro',
    site_id: 'site-9',
    location: 'Réception',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:26:00Z',
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-09T08:26:00Z',
  },
  {
    id: 'device-13',
    name: 'Lecteur Biométrique La Défense',
    serial_number: 'BIO-2023-010',
    model: 'BioPro X800',
    site_id: 'site-10',
    location: 'Entrée Tour',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:31:00Z',
    created_at: '2023-01-20T09:00:00Z',
    updated_at: '2024-11-09T08:31:00Z',
  },
  {
    id: 'device-14',
    name: 'Lecteur Biométrique Nantes',
    serial_number: 'BIO-2023-011',
    model: 'BioPro X600',
    site_id: 'site-11',
    location: 'Entrée principale',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:19:00Z',
    created_at: '2023-03-15T10:30:00Z',
    updated_at: '2024-11-09T08:19:00Z',
  },
  {
    id: 'device-15',
    name: 'Lecteur Biométrique Strasbourg',
    serial_number: 'BIO-2023-012',
    model: 'BioPro X600',
    site_id: 'site-12',
    location: 'Entrée principale',
    status: DeviceStatus.Offline,
    last_sync: '2024-11-08T16:30:00Z',
    created_at: '2023-05-25T08:45:00Z',
    updated_at: '2024-11-08T16:30:00Z',
  },
];

/**
 * In-memory store
 */
let devicesStore = [...mockDevices];

/**
 * Enrich device with related entities
 */
const enrichDevice = (device: Device): any => {
  const site = mockSites.find(s => s.id === device.site_id);
  const organization = site ? mockOrganizations.find(o => o.id === site.organization_id) : null;

  return {
    ...device,
    type: device.model || 'Biometric Reader',
    site: site ? {
      id: site.id,
      name: site.name,
      organization_id: site.organization_id,
    } : null,
    organization: organization ? {
      id: organization.id,
      name: organization.name,
    } : null,
    last_attendance_timestamp: device.last_sync,
    daily_attendance_count: device.status === DeviceStatus.Online ? Math.floor(Math.random() * 50) + 10 : 0,
  };
};

/**
 * GET /api/v1/devices
 */
export const getDevicesHandler = (request: any): PaginatedResponse<Device> => {
  const { page, page_size, search, site_id, status } = request.query;

  let filteredDevices = [...devicesStore];

  if (search) {
    filteredDevices = filterBySearch(filteredDevices, search, ['name', 'serial_number', 'model', 'location']);
  }

  if (site_id) {
    filteredDevices = filteredDevices.filter(d => d.site_id === site_id);
  }

  if (status) {
    filteredDevices = filteredDevices.filter(d => d.status === status);
  }

  const enrichedDevices = filteredDevices.map(enrichDevice);

  return paginate(enrichedDevices, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * GET /api/v1/devices/:id
 */
export const getDeviceByIdHandler = (request: any): Device => {
  const { id } = request.params;
  const device = devicesStore.find(d => d.id === id);

  if (!device) {
    throw createMockError(404, { detail: 'Device not found' });
  }

  return enrichDevice(device);
};

/**
 * POST /api/v1/devices
 */
export const createDeviceHandler = (request: any): Device => {
  const data = request.body;

  if (!data.name || !data.serial_number || !data.site_id) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'name, serial_number, and site_id are required', type: 'value_error.missing' }],
    });
  }

  if (devicesStore.some(d => d.serial_number === data.serial_number)) {
    throw createMockError(400, { detail: 'Serial number already exists' });
  }

  const now = new Date().toISOString();
  const newDevice: Device = {
    id: randomUUID(),
    name: data.name,
    serial_number: data.serial_number,
    model: data.model || null,
    site_id: data.site_id,
    location: data.location || null,
    status: data.status || DeviceStatus.Online,
    last_sync: now,
    created_at: now,
    updated_at: now,
  };

  devicesStore.push(newDevice);
  return newDevice;
};

/**
 * PUT /api/v1/devices/:id
 */
export const updateDeviceHandler = (request: any): Device => {
  const { id } = request.params;
  const data = request.body;

  const index = devicesStore.findIndex(d => d.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Device not found' });
  }

  if (data.serial_number && data.serial_number !== devicesStore[index].serial_number) {
    if (devicesStore.some(d => d.serial_number === data.serial_number && d.id !== id)) {
      throw createMockError(400, { detail: 'Serial number already exists' });
    }
  }

  const updatedDevice: Device = {
    ...devicesStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  devicesStore[index] = updatedDevice;
  return updatedDevice;
};

/**
 * DELETE /api/v1/devices/:id
 */
export const deleteDeviceHandler = (request: any): void => {
  const { id } = request.params;

  const index = devicesStore.findIndex(d => d.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Device not found' });
  }

  devicesStore.splice(index, 1);
};

/**
 * Reset devices store
 */
export const resetDevicesStore = () => {
  devicesStore = [...mockDevices];
};

/**
 * Export device handlers
 */
export const deviceHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/devices',
    handler: getDevicesHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/devices/:id',
    handler: getDeviceByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/devices',
    handler: createDeviceHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/devices/:id',
    handler: updateDeviceHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/devices/:id',
    handler: deleteDeviceHandler,
  },
];
