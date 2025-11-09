/**
 * Notifications Mock Data and Handlers
 */

import { Notification, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: '2',
    title: 'Nouvelle demande de congé',
    message: 'Lucas Petit a soumis une demande de congé pour le 15-18 novembre',
    type: 'leave_request',
    is_read: false,
    created_at: '2024-11-08T16:05:00Z',
  },
  {
    id: 'notif-2',
    user_id: '2',
    title: 'Appareil hors ligne',
    message: 'Le lecteur biométrique Marseille - Sortie est hors ligne depuis 2 heures',
    type: 'device_offline',
    is_read: false,
    created_at: '2024-11-09T06:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: '2',
    title: 'Congé approuvé',
    message: 'Votre demande de congé pour le 20-31 décembre a été approuvée',
    type: 'leave_approved',
    is_read: true,
    created_at: '2024-11-01T10:05:00Z',
  },
];

let notificationsStore = [...mockNotifications];

export const getNotificationsHandler = (request: any): PaginatedResponse<Notification> => {
  const { page, page_size, is_read } = request.query;
  let filtered = [...notificationsStore];

  if (is_read !== undefined) {
    filtered = filtered.filter(n => n.is_read === (is_read === 'true'));
  }

  return paginate(filtered, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

export const markAsReadHandler = (request: any): Notification => {
  const { id } = request.params;
  const notif = notificationsStore.find(n => n.id === id);

  if (!notif) {
    throw createMockError(404, { detail: 'Notification not found' });
  }

  notif.is_read = true;
  return notif;
};

export const markAllAsReadHandler = (): { marked: number } => {
  const count = notificationsStore.filter(n => !n.is_read).length;
  notificationsStore.forEach(n => n.is_read = true);
  return { marked: count };
};

export const deleteNotificationHandler = (request: any): void => {
  const { id } = request.params;
  const index = notificationsStore.findIndex(n => n.id === id);

  if (index === -1) {
    throw createMockError(404, { detail: 'Notification not found' });
  }

  notificationsStore.splice(index, 1);
};

export const notificationHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/notifications',
    handler: getNotificationsHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/notifications/:id/read',
    handler: markAsReadHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/notifications/read-all',
    handler: markAllAsReadHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/notifications/:id',
    handler: deleteNotificationHandler,
  },
];
