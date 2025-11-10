/**
 * Departments Mock Data and Handlers
 */

import { Department, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID } from '../utils/generators';
import { mockSites } from './sites.mock';
import { mockEmployees } from './employees.mock';

/**
 * Initial mock departments data
 */
export const mockDepartments: Department[] = [
  // TechCorp Paris HQ departments (site-1)
  { id: 'dept-1', name: 'Informatique', site_id: 'site-1', manager_id: 'emp-1', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-11-01T14:30:00Z' },
  { id: 'dept-2', name: 'Ressources Humaines', site_id: 'site-1', manager_id: 'emp-2', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-11-01T14:30:00Z' },
  { id: 'dept-3', name: 'Commercial', site_id: 'site-1', manager_id: 'emp-3', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-11-01T14:30:00Z' },
  { id: 'dept-4', name: 'Marketing', site_id: 'site-1', manager_id: 'emp-4', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-11-01T14:30:00Z' },
  { id: 'dept-5', name: 'Finance', site_id: 'site-1', manager_id: 'emp-5', created_at: '2023-01-15T10:00:00Z', updated_at: '2024-11-01T14:30:00Z' },

  // TechCorp Marseille departments (site-2)
  { id: 'dept-6', name: 'Informatique', site_id: 'site-2', manager_id: 'emp-11', created_at: '2023-02-10T11:00:00Z', updated_at: '2024-10-20T09:15:00Z' },
  { id: 'dept-7', name: 'Support Client', site_id: 'site-2', manager_id: 'emp-12', created_at: '2023-02-10T11:00:00Z', updated_at: '2024-10-20T09:15:00Z' },
  { id: 'dept-8', name: 'Logistique', site_id: 'site-2', manager_id: 'emp-13', created_at: '2023-02-10T11:00:00Z', updated_at: '2024-10-20T09:15:00Z' },

  // TechCorp Lyon departments (site-3)
  { id: 'dept-9', name: 'R&D', site_id: 'site-3', manager_id: 'emp-14', created_at: '2023-04-05T09:30:00Z', updated_at: '2024-10-25T16:00:00Z' },
  { id: 'dept-10', name: 'Production', site_id: 'site-3', manager_id: 'emp-15', created_at: '2023-04-05T09:30:00Z', updated_at: '2024-10-25T16:00:00Z' },
  { id: 'dept-11', name: 'Qualité', site_id: 'site-3', manager_id: 'emp-16', created_at: '2023-04-05T09:30:00Z', updated_at: '2024-10-25T16:00:00Z' },

  // TechCorp Bordeaux departments (site-4)
  { id: 'dept-12', name: 'Commercial', site_id: 'site-4', manager_id: 'emp-17', created_at: '2023-06-15T08:00:00Z', updated_at: '2024-11-03T11:20:00Z' },
  { id: 'dept-13', name: 'Marketing', site_id: 'site-4', manager_id: 'emp-18', created_at: '2023-06-15T08:00:00Z', updated_at: '2024-11-03T11:20:00Z' },

  // TechCorp Lille departments (site-5)
  { id: 'dept-14', name: 'Informatique', site_id: 'site-5', manager_id: 'emp-19', created_at: '2023-08-20T10:30:00Z', updated_at: '2024-10-30T13:45:00Z' },
  { id: 'dept-15', name: 'Administration', site_id: 'site-5', manager_id: 'emp-20', created_at: '2023-08-20T10:30:00Z', updated_at: '2024-10-30T13:45:00Z' },

  // InnovateLab Lyon Central departments (site-6)
  { id: 'dept-16', name: 'R&D', site_id: 'site-6', manager_id: 'emp-21', created_at: '2023-03-20T09:00:00Z', updated_at: '2024-10-15T16:45:00Z' },
  { id: 'dept-17', name: 'Innovation', site_id: 'site-6', manager_id: 'emp-22', created_at: '2023-03-20T09:00:00Z', updated_at: '2024-10-15T16:45:00Z' },
  { id: 'dept-18', name: 'Projets', site_id: 'site-6', manager_id: 'emp-23', created_at: '2023-03-20T09:00:00Z', updated_at: '2024-10-15T16:45:00Z' },

  // InnovateLab Grenoble departments (site-7)
  { id: 'dept-19', name: 'Recherche', site_id: 'site-7', manager_id: 'emp-24', created_at: '2023-05-10T10:00:00Z', updated_at: '2024-10-22T14:00:00Z' },
  { id: 'dept-20', name: 'Développement', site_id: 'site-7', manager_id: 'emp-25', created_at: '2023-05-10T10:00:00Z', updated_at: '2024-10-22T14:00:00Z' },

  // InnovateLab Toulouse departments (site-8)
  { id: 'dept-21', name: 'Innovation', site_id: 'site-8', manager_id: 'emp-22', created_at: '2023-07-12T11:30:00Z', updated_at: '2024-11-02T10:30:00Z' },
  { id: 'dept-22', name: 'Prototypage', site_id: 'site-8', manager_id: 'emp-23', created_at: '2023-07-12T11:30:00Z', updated_at: '2024-11-02T10:30:00Z' },

  // GlobalServices Paris 9e departments (site-9)
  { id: 'dept-23', name: 'Consulting', site_id: 'site-9', manager_id: 'emp-26', created_at: '2022-11-10T11:00:00Z', updated_at: '2024-11-05T10:20:00Z' },
  { id: 'dept-24', name: 'Audit', site_id: 'site-9', manager_id: 'emp-27', created_at: '2022-11-10T11:00:00Z', updated_at: '2024-11-05T10:20:00Z' },
  { id: 'dept-25', name: 'Direction', site_id: 'site-9', manager_id: 'emp-28', created_at: '2022-11-10T11:00:00Z', updated_at: '2024-11-05T10:20:00Z' },

  // GlobalServices La Défense departments (site-10)
  { id: 'dept-26', name: 'Services Clients', site_id: 'site-10', manager_id: 'emp-29', created_at: '2023-01-20T09:00:00Z', updated_at: '2024-10-18T15:30:00Z' },
  { id: 'dept-27', name: 'Support', site_id: 'site-10', manager_id: 'emp-30', created_at: '2023-01-20T09:00:00Z', updated_at: '2024-10-18T15:30:00Z' },

  // GlobalServices Nantes departments (site-11)
  { id: 'dept-28', name: 'Commercial', site_id: 'site-11', manager_id: 'emp-26', created_at: '2023-03-15T10:30:00Z', updated_at: '2024-10-28T12:15:00Z' },
  { id: 'dept-29', name: 'Marketing', site_id: 'site-11', manager_id: 'emp-27', created_at: '2023-03-15T10:30:00Z', updated_at: '2024-10-28T12:15:00Z' },

  // GlobalServices Strasbourg departments (site-12)
  { id: 'dept-30', name: 'Ressources Humaines', site_id: 'site-12', manager_id: 'emp-28', created_at: '2023-05-25T08:45:00Z', updated_at: '2024-11-01T09:00:00Z' },

  // DataTech Toulouse HQ departments (site-13)
  { id: 'dept-31', name: 'Data Science', site_id: 'site-13', manager_id: 'emp-21', created_at: '2023-06-05T08:30:00Z', updated_at: '2024-10-28T12:00:00Z' },
  { id: 'dept-32', name: 'Analytics', site_id: 'site-13', manager_id: 'emp-24', created_at: '2023-06-05T08:30:00Z', updated_at: '2024-10-28T12:00:00Z' },

  // DataTech Montpellier departments (site-14)
  { id: 'dept-33', name: 'Business Intelligence', site_id: 'site-14', manager_id: 'emp-25', created_at: '2023-08-10T09:00:00Z', updated_at: '2024-10-15T14:30:00Z' },
];

/**
 * In-memory store
 */
let departmentsStore = [...mockDepartments];

/**
 * Enrich department with related entities
 */
const enrichDepartment = (dept: Department): any => {
  const site = mockSites.find(s => s.id === dept.site_id);
  const manager = dept.manager_id ? mockEmployees.find(e => e.id === dept.manager_id) : null;
  const employees = mockEmployees.filter(e => e.department_id === dept.id);

  return {
    ...dept,
    site: site || null,
    manager: manager ? {
      id: manager.id,
      full_name: `${manager.first_name} ${manager.last_name}`,
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
    } : null,
    employees_count: employees.length,
  };
};

/**
 * GET /api/v1/departments
 */
export const getDepartmentsHandler = (request: any): PaginatedResponse<Department> => {
  const { page, page_size, search, site_id } = request.query;

  let filteredDepts = [...departmentsStore];

  if (search) {
    filteredDepts = filterBySearch(filteredDepts, search, ['name']);
  }

  if (site_id) {
    filteredDepts = filteredDepts.filter(d => d.site_id === site_id);
  }

  const enrichedDepts = filteredDepts.map(enrichDepartment);

  return paginate(enrichedDepts, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
};

/**
 * GET /api/v1/departments/:id
 */
export const getDepartmentByIdHandler = (request: any): Department => {
  const { id } = request.params;
  const dept = departmentsStore.find(d => d.id === id);

  if (!dept) {
    throw createMockError(404, { detail: 'Department not found' });
  }

  return enrichDepartment(dept);
};

/**
 * POST /api/v1/departments
 */
export const createDepartmentHandler = (request: any): Department => {
  const data = request.body;

  if (!data.name || !data.site_id) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'name and site_id are required', type: 'value_error.missing' }],
    });
  }

  const now = new Date().toISOString();
  const newDept: Department = {
    id: randomUUID(),
    name: data.name,
    site_id: data.site_id,
    manager_id: data.manager_id || null,
    created_at: now,
    updated_at: now,
  };

  departmentsStore.push(newDept);
  return newDept;
};

/**
 * PUT /api/v1/departments/:id
 */
export const updateDepartmentHandler = (request: any): Department => {
  const { id } = request.params;
  const data = request.body;

  const index = departmentsStore.findIndex(d => d.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Department not found' });
  }

  const updatedDept: Department = {
    ...departmentsStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  departmentsStore[index] = updatedDept;
  return updatedDept;
};

/**
 * DELETE /api/v1/departments/:id
 */
export const deleteDepartmentHandler = (request: any): void => {
  const { id } = request.params;

  const index = departmentsStore.findIndex(d => d.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Department not found' });
  }

  departmentsStore.splice(index, 1);
};

/**
 * Reset departments store
 */
export const resetDepartmentsStore = () => {
  departmentsStore = [...mockDepartments];
};

/**
 * Export department handlers
 */
export const departmentHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/departments',
    handler: getDepartmentsHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/departments/:id',
    handler: getDepartmentByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/departments',
    handler: createDepartmentHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/departments/:id',
    handler: updateDepartmentHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/departments/:id',
    handler: deleteDepartmentHandler,
  },
];
