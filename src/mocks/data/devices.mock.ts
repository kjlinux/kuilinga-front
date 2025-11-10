/**
 * Devices Mock Data and Handlers
 */

import { Device, DeviceStatus, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockSites } from './sites.mock';
import { mockOrganizations } from './organizations.mock';

/**
 * Internal device structure (flat for easier management)
 */
interface DeviceInternal {
  id: string;
  serial_number: string;
  type: string;
  site_id: string;
  status: DeviceStatus;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Initial mock devices data (internal structure)
 */
const mockDevicesInternal: DeviceInternal[] = [
  {
    id: 'device-1',
    serial_number: 'BIO-2023-001',
    type: 'BioPro X500',
    site_id: 'site-1',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:30:00Z',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-09T08:30:00Z',
  },
  {
    id: 'device-2',
    serial_number: 'BIO-2023-002',
    type: 'BioPro X500',
    site_id: 'site-1',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:32:00Z',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-09T08:32:00Z',
  },
  {
    id: 'device-3',
    serial_number: 'BADGE-2023-001',
    type: 'AccessCard Pro',
    site_id: 'site-1',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:25:00Z',
    created_at: '2023-02-01T10:00:00Z',
    updated_at: '2024-11-09T08:25:00Z',
  },
  {
    id: 'device-4',
    serial_number: 'BIO-2023-003',
    type: 'BioPro X500',
    site_id: 'site-2',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:20:00Z',
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-11-09T08:20:00Z',
  },
  {
    id: 'device-5',
    serial_number: 'BIO-2023-004',
    type: 'BioPro X500',
    site_id: 'site-2',
    status: DeviceStatus.Offline,
    last_sync: '2024-11-08T17:45:00Z',
    created_at: '2023-02-10T11:00:00Z',
    updated_at: '2024-11-08T17:45:00Z',
  },
  {
    id: 'device-6',
    serial_number: 'BIO-2023-005',
    type: 'BioPro X600',
    site_id: 'site-3',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:28:00Z',
    created_at: '2023-04-05T09:30:00Z',
    updated_at: '2024-11-09T08:28:00Z',
  },
  {
    id: 'device-7',
    serial_number: 'BIO-2023-006',
    type: 'BioPro X600',
    site_id: 'site-4',
    status: DeviceStatus.Maintenance,
    last_sync: '2024-11-07T14:00:00Z',
    created_at: '2023-06-15T08:00:00Z',
    updated_at: '2024-11-07T14:00:00Z',
  },
  {
    id: 'device-8',
    serial_number: 'BIO-2023-007',
    type: 'BioPro X600',
    site_id: 'site-5',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:15:00Z',
    created_at: '2023-08-20T10:30:00Z',
    updated_at: '2024-11-09T08:15:00Z',
  },
  {
    id: 'device-9',
    serial_number: 'BADGE-2023-002',
    type: 'AccessCard Elite',
    site_id: 'site-6',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:35:00Z',
    created_at: '2023-03-20T09:00:00Z',
    updated_at: '2024-11-09T08:35:00Z',
  },
  {
    id: 'device-10',
    serial_number: 'BIO-2023-008',
    type: 'BioPro X700',
    site_id: 'site-7',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:18:00Z',
    created_at: '2023-05-10T10:00:00Z',
    updated_at: '2024-11-09T08:18:00Z',
  },
  {
    id: 'device-11',
    serial_number: 'BIO-2023-009',
    type: 'BioPro X700',
    site_id: 'site-8',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:22:00Z',
    created_at: '2023-07-12T11:30:00Z',
    updated_at: '2024-11-09T08:22:00Z',
  },
  {
    id: 'device-12',
    serial_number: 'BADGE-2023-003',
    type: 'AccessCard Pro',
    site_id: 'site-9',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:26:00Z',
    created_at: '2022-11-10T11:00:00Z',
    updated_at: '2024-11-09T08:26:00Z',
  },
  {
    id: 'device-13',
    serial_number: 'BIO-2023-010',
    type: 'BioPro X800',
    site_id: 'site-10',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:31:00Z',
    created_at: '2023-01-20T09:00:00Z',
    updated_at: '2024-11-09T08:31:00Z',
  },
  {
    id: 'device-14',
    serial_number: 'BIO-2023-011',
    type: 'BioPro X600',
    site_id: 'site-11',
    status: DeviceStatus.Online,
    last_sync: '2024-11-09T08:19:00Z',
    created_at: '2023-03-15T10:30:00Z',
    updated_at: '2024-11-09T08:19:00Z',
  },
  {
    id: 'device-15',
    serial_number: 'BIO-2023-012',
    type: 'BioPro X600',
    site_id: 'site-12',
    status: DeviceStatus.Offline,
    last_sync: '2024-11-08T16:30:00Z',
    created_at: '2023-05-25T08:45:00Z',
    updated_at: '2024-11-08T16:30:00Z',
  },
];

/**
 * In-memory store
 */
let devicesStore = [...mockDevicesInternal];

/**
 * Enrich device with related entities to match Device type
 */
const enrichDevice = (device: DeviceInternal): Device => {
  const site = mockSites.find(s => s.id === device.site_id);
  const organization = site ? mockOrganizations.find(o => o.id === site.organization_id) : null;

  return {
    id: device.id,
    serial_number: device.serial_number,
    type: device.type,
    status: device.status,
    site: site ? {
      id: site.id,
      name: site.name,
      address: site.address || null,
      timezone: site.timezone,
    } : null,
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
    last_attendance_timestamp: device.last_sync || null,
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
    filteredDevices = filterBySearch(filteredDevices, search, ['serial_number', 'type']);
  }

  if (site_id) {
    filteredDevices = filteredDevices.filter(d => d.site_id === site_id);
  }

  if (status) {
    filteredDevices = filteredDevices.filter(d => d.status === status);
  }

  const enrichedDevices = filteredDevices.map(enrichDevice);

  return paginate(enrichedDevices, pageToSkipLimit(page, page_size));
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

  if (!data.serial_number || !data.type || !data.site_id) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'serial_number, type, and site_id are required', type: 'value_error.missing' }],
    });
  }

  if (devicesStore.some(d => d.serial_number === data.serial_number)) {
    throw createMockError(400, { detail: 'Serial number already exists' });
  }

  const now = new Date().toISOString();
  const newDevice: DeviceInternal = {
    id: randomUUID(),
    serial_number: data.serial_number,
    type: data.type,
    site_id: data.site_id,
    status: data.status || DeviceStatus.Online,
    last_sync: now,
    created_at: now,
    updated_at: now,
  };

  devicesStore.push(newDevice);
  return enrichDevice(newDevice);
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

  const updatedDevice: DeviceInternal = {
    ...devicesStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  devicesStore[index] = updatedDevice;
  return enrichDevice(updatedDevice);
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
  devicesStore = [...mockDevicesInternal];
};

/**
 * Export enriched devices for use in other mocks
 */
export const mockDevices = mockDevicesInternal.map(enrichDevice);

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
