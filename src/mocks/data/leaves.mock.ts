/**
 * Leaves Mock Data and Handlers
 */

import { Leave, LeaveType, LeaveStatus, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Internal leave structure (flat for easier management)
 */
interface LeaveInternal {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  notes?: string | null;
  status: LeaveStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  comments?: string | null;
}

/**
 * Initial mock leaves data (internal structure)
 */
const mockLeavesInternal: LeaveInternal[] = [
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
    comments: 'Demande rejetée car effectif minimal requis ce jour-là',
  },
];

/**
 * Export internal leaves for other mocks to import
 */
export const mockLeaves = mockLeavesInternal;

/**
 * In-memory store
 */
let leavesStore = [...mockLeavesInternal];

/**
 * Helper function to enrich a leave with employee and approver details
 */
const enrichLeave = (leave: LeaveInternal): Leave => {
  // Lazy imports to avoid circular dependencies
  const { mockEmployees } = require('./employees.mock');
  const { mockDepartments } = require('./departments.mock');

  const employee = mockEmployees.find((emp: any) => emp.id === leave.employee_id);
  const approver = leave.approved_by ? mockEmployees.find((emp: any) => emp.id === leave.approved_by) : null;
  const department = employee?.department_id ? mockDepartments.find((d: any) => d.id === employee.department_id) : null;

  // Calculate duration in days
  const startDate = new Date(leave.start_date);
  const endDate = new Date(leave.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    id: leave.id,
    leave_type: leave.leave_type,
    start_date: leave.start_date,
    end_date: leave.end_date,
    reason: leave.reason,
    notes: leave.notes || null,
    status: leave.status,
    duration,
    employee: employee ? {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: `${employee.first_name} ${employee.last_name}`,
      department: department ? {
        id: department.id,
        name: department.name,
      } : null,
    } : null,
    approver: approver ? {
      id: approver.id,
      full_name: `${approver.first_name} ${approver.last_name}`,
    } : null,
  };
};

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

  const enrichedLeaves = filteredLeaves.map(enrichLeave);

  return paginate(enrichedLeaves, pageToSkipLimit(page, page_size));
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

  return enrichLeave(leave);
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

  const newLeave: LeaveInternal = {
    id: randomUUID(),
    employee_id: data.employee_id,
    leave_type: data.leave_type,
    start_date: data.start_date,
    end_date: data.end_date,
    reason: data.reason || '',
    notes: data.notes || null,
    status: LeaveStatus.Pending,
    approved_by: null,
    approved_at: null,
    comments: null,
  };

  leavesStore.push(newLeave);
  return enrichLeave(newLeave);
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

  const updatedLeave: LeaveInternal = {
    ...leavesStore[index],
    leave_type: data.leave_type !== undefined ? data.leave_type : leavesStore[index].leave_type,
    start_date: data.start_date !== undefined ? data.start_date : leavesStore[index].start_date,
    end_date: data.end_date !== undefined ? data.end_date : leavesStore[index].end_date,
    reason: data.reason !== undefined ? data.reason : leavesStore[index].reason,
    notes: data.notes !== undefined ? data.notes : leavesStore[index].notes,
    status: data.status !== undefined ? data.status : leavesStore[index].status,
    approved_by: data.approved_by !== undefined ? data.approved_by : leavesStore[index].approved_by,
    approved_at: data.approved_at !== undefined ? data.approved_at : leavesStore[index].approved_at,
    comments: data.comments !== undefined ? data.comments : leavesStore[index].comments,
    id,
  };

  leavesStore[index] = updatedLeave;
  return enrichLeave(updatedLeave);
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
  leavesStore = [...mockLeavesInternal];
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
