import {
  readDevicesApiV1DevicesGet,
  readDeviceApiV1DevicesDeviceIdGet,
  createDeviceApiV1DevicesPost,
  updateDeviceApiV1DevicesDeviceIdPut,
  deleteDeviceApiV1DevicesDeviceIdDelete,
} from "@/api";
import type {
  Device,
  DeviceCreate,
  DeviceUpdate,
  PaginatedResponseDevice,
} from "@/api";

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

class DeviceService {
  async getDevices(params: PaginationParams = {}): Promise<PaginatedResponseDevice> {
    const response = await readDevicesApiV1DevicesGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
      },
    });
    return response.data as PaginatedResponseDevice;
  }

  async getDevice(id: string): Promise<Device> {
    const response = await readDeviceApiV1DevicesDeviceIdGet({
      path: { device_id: id },
    });
    return response.data as Device;
  }

  async createDevice(data: DeviceCreate): Promise<Device> {
    const response = await createDeviceApiV1DevicesPost({
      body: data,
    });
    return response.data as Device;
  }

  async updateDevice(id: string, data: DeviceUpdate): Promise<Device> {
    const response = await updateDeviceApiV1DevicesDeviceIdPut({
      path: { device_id: id },
      body: data,
    });
    return response.data as Device;
  }

  async deleteDevice(id: string): Promise<void> {
    await deleteDeviceApiV1DevicesDeviceIdDelete({
      path: { device_id: id },
    });
  }
}

export default new DeviceService();
