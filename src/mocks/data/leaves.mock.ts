/**
 * Leaves Mock Data and Handlers
 */

import { Leave, LeaveType, LeaveStatus, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID, randomElement } from '../utils/generators';

/**
 * Initial mock leaves data
 */
export const mockLeaves: Leave[] = [
  {
    id: 'leave-1',
    employee_id: 'emp-1',
    leave_type: LeaveType.Annual,
    start_date: '2024-12-20',
    end_date: '2024-12-31',
    reason: 'Congés de fin d\'année',
    status: LeaveStatus.Approved,
    approved_by: 'emp-2',
    approved_at: '2024-11-01T10:00:00Z',
    created_at: '2024-10-25T14:30:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 'leave-2',
    employee_id: 'emp-6',
    leave_type: LeaveType.Sick,
    start_date: '2024-11-05',
    end_date: '2024-11-06',
    reason: 'Maladie',
    status: LeaveStatus.Approved,
    approved_by: 'emp-2',
    approved_at: '2024-11-05T09:00:00Z',
    created_at: '2024-11-05T08:30:00Z',
    updated_at: '2024-11-05T09:00:00Z',
  },
  {
    id: 'leave-3',
    employee_id: 'emp-9',
    leave_type: LeaveType.Annual,
    start_date: '2024-11-15',
    end_date: '2024-11-18',
    reason: 'Congés personnels',
    status: LeaveStatus.Pending,
    approved_by: null,
    approved_at: null,
    created_at: '2024-11-08T16:00:00Z',
    updated_at: '2024-11-08T16:00:00Z',
  },
  {
    id: 'leave-4',
    employee_id: 'emp-10',
    leave_type: LeaveType.Annual,
    start_date: '2024-11-25',
    end_date: '2024-11-29',
    reason: 'Pont de fin novembre',
    status: LeaveStatus.Pending,
    approved_by: null,
    approved_at: null,
    created_at: '2024-11-07T10:15:00Z',
    updated_at: '2024-11-07T10:15:00Z',
  },
  {
    id: 'leave-5',
    employee_id: 'emp-3',
    leave_type: LeaveType.Other,
    start_date: '2024-10-28',
    end_date: '2024-10-28',
    reason: 'Déménagement',
    status: LeaveStatus.Rejected,
    approved_by: 'emp-2',
    approved_at: '2024-10-27T15:00:00Z',
    created_at: '2024-10-25T11:00:00Z',
    updated_at: '2024-10-27T15:00:00Z',
  },
];

/**
 * In-memory store
 */
let leavesStore = [...mockLeaves];

/**
 * GET /api/v1/leaves
 */
export const getLeavesHandler = (request: any): PaginatedResponse<Leave> => {
  const { page, page_size, search, employee_id, status, leave_type } = request.query;

  let filteredLeaves = [...leavesStore];

  if (employee_id) {
    filteredLeaves = filteredLeaves.filter(l => l.employee_id === employee_id);
  }

  if (status) {
    filteredLeaves = filteredLeaves.filter(l => l.status === status);
  }

  if (leave_type) {
    filteredLeaves = filteredLeaves.filter(l => l.leave_type === leave_type);
  }

  if (search) {
    filteredLeaves = filterBySearch(filteredLeaves, search, ['reason']);
  }

  return paginate(filteredLeaves, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * GET /api/v1/leaves/:id
 */
export const getLeaveByIdHandler = (request: any): Leave => {
  const { id } = request.params;
  const leave = leavesStore.find(l => l.id === id);

  if (!leave) {
    throw createMockError(404, { detail: 'Leave not found' });
  }

  return leave;
};

/**
 * POST /api/v1/leaves
 */
export const createLeaveHandler = (request: any): Leave => {
  const data = request.body;

  if (!data.employee_id || !data.leave_type || !data.start_date || !data.end_date) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'employee_id, leave_type, start_date, and end_date are required', type: 'value_error.missing' }],
    });
  }

  const now = new Date().toISOString();
  const newLeave: Leave = {
    id: randomUUID(),
    employee_id: data.employee_id,
    leave_type: data.leave_type,
    start_date: data.start_date,
    end_date: data.end_date,
    reason: data.reason || null,
    status: LeaveStatus.Pending,
    approved_by: null,
    approved_at: null,
    created_at: now,
    updated_at: now,
  };

  leavesStore.push(newLeave);
  return newLeave;
};

/**
 * PUT /api/v1/leaves/:id
 */
export const updateLeaveHandler = (request: any): Leave => {
  const { id } = request.params;
  const data = request.body;

  const index = leavesStore.findIndex(l => l.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Leave not found' });
  }

  const updatedLeave: Leave = {
    ...leavesStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  leavesStore[index] = updatedLeave;
  return updatedLeave;
};

/**
 * DELETE /api/v1/leaves/:id
 */
export const deleteLeaveHandler = (request: any): void => {
  const { id } = request.params;

  const index = leavesStore.findIndex(l => l.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Leave not found' });
  }

  leavesStore.splice(index, 1);
};

/**
 * Reset leaves store
 */
export const resetLeavesStore = () => {
  leavesStore = [...mockLeaves];
};

/**
 * Export leave handlers
 */
export const leaveHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/leaves',
    handler: getLeavesHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/leaves/:id',
    handler: getLeaveByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/leaves',
    handler: createLeaveHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/leaves/:id',
    handler: updateLeaveHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/leaves/:id',
    handler: deleteLeaveHandler,
  },
];
