import {
  readDevicesApiV1DevicesGet,
  readDeviceApiV1DevicesDeviceIdGet,
  createDeviceApiV1DevicesPost,
  updateDeviceApiV1DevicesDeviceIdPut,
  deleteDeviceApiV1DevicesDeviceIdDelete,
  sendDeviceCommandApiV1DevicesDeviceIdCommandPost,
  rebootDeviceApiV1DevicesDeviceIdRebootPost,
  resetDeviceApiV1DevicesDeviceIdResetPost,
  sleepDeviceApiV1DevicesDeviceIdSleepPost,
  requestDeviceStatusApiV1DevicesDeviceIdStatusPost,
  sendBulkCommandApiV1DevicesBulkCommandPost,
  getMqttStatusApiV1DevicesMqttStatusGet,
} from "@/api";
import type {
  Device,
  DeviceCreate,
  DeviceUpdate,
  PaginatedResponseDevice,
  DeviceCommandType,
  DeviceCommandResponse,
  DeviceBulkCommandResponse,
} from "@/api";

// Type local pour MQTT status (le backend retourne un objet generique)
export interface MqttStatus {
  connected: boolean;
  broker_host: string | null;
  broker_port: number | null;
}

// Codes de commande hexadecimaux pour reference/affichage
export const DEVICE_COMMAND_CODES: Record<DeviceCommandType, string> = {
  reset: '0x108070',
  reboot: '0x108090',
  sleep: '0x1080B0',
  status: '0x100010',
} as const;

// Labels en francais pour les commandes
export const DEVICE_COMMAND_LABELS: Record<DeviceCommandType, string> = {
  status: 'Demander statut',
  reboot: 'Redemarrer',
  reset: 'Reinitialiser',
  sleep: 'Mettre en veille',
} as const;

import type { PaginationParams } from "@/hooks/useDataTable";

class DeviceService {
  async getDevices(params: PaginationParams = {}): Promise<PaginatedResponseDevice> {
    const response = await readDevicesApiV1DevicesGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
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

  // ========== Methodes de commande IoT ==========

  /**
   * Envoie une commande generique a un terminal
   */
  async sendCommand(
    deviceId: string,
    command: DeviceCommandType
  ): Promise<DeviceCommandResponse> {
    const response = await sendDeviceCommandApiV1DevicesDeviceIdCommandPost({
      path: { device_id: deviceId },
      body: { command },
    });
    return response.data as DeviceCommandResponse;
  }

  /**
   * Redemarrer un terminal (raccourci pour commande REBOOT 0x108090)
   */
  async rebootDevice(deviceId: string): Promise<DeviceCommandResponse> {
    const response = await rebootDeviceApiV1DevicesDeviceIdRebootPost({
      path: { device_id: deviceId },
    });
    return response.data as DeviceCommandResponse;
  }

  /**
   * Reinitialiser un terminal (raccourci pour commande RESET 0x108070)
   */
  async resetDevice(deviceId: string): Promise<DeviceCommandResponse> {
    const response = await resetDeviceApiV1DevicesDeviceIdResetPost({
      path: { device_id: deviceId },
    });
    return response.data as DeviceCommandResponse;
  }

  /**
   * Mettre un terminal en veille (raccourci pour commande SLEEP 0x1080B0)
   */
  async sleepDevice(deviceId: string): Promise<DeviceCommandResponse> {
    const response = await sleepDeviceApiV1DevicesDeviceIdSleepPost({
      path: { device_id: deviceId },
    });
    return response.data as DeviceCommandResponse;
  }

  /**
   * Demander le statut d'un terminal (raccourci pour commande STATUS 0x100010)
   */
  async requestStatus(deviceId: string): Promise<DeviceCommandResponse> {
    const response = await requestDeviceStatusApiV1DevicesDeviceIdStatusPost({
      path: { device_id: deviceId },
    });
    return response.data as DeviceCommandResponse;
  }

  /**
   * Envoie une commande a plusieurs terminaux en une seule requete
   */
  async sendBulkCommand(
    deviceIds: string[],
    command: DeviceCommandType
  ): Promise<DeviceBulkCommandResponse> {
    const response = await sendBulkCommandApiV1DevicesBulkCommandPost({
      body: { device_ids: deviceIds, command },
    });
    return response.data as DeviceBulkCommandResponse;
  }

  /**
   * Verifie l'etat de la connexion au broker MQTT
   */
  async getMqttStatus(): Promise<MqttStatus> {
    const response = await getMqttStatusApiV1DevicesMqttStatusGet();
    return response.data as unknown as MqttStatus;
  }
}

export default new DeviceService();
