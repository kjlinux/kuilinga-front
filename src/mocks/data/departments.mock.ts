/**
 * Departments Mock Data and Handlers
 */

import { Department, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Internal department structure (flat for easier management)
 */
interface DepartmentInternal {
  id: string;
  name: string;
  site_id: string;
  manager_id?: string | null;
}

/**
 * Initial mock departments data (internal structure)
 */
const mockDepartmentsInternal: DepartmentInternal[] = [
  // TechCorp Paris HQ departments (site-1)
  { id: 'dept-1', name: 'Informatique', site_id: 'site-1', manager_id: 'emp-1' },
  { id: 'dept-2', name: 'Ressources Humaines', site_id: 'site-1', manager_id: 'emp-2' },
  { id: 'dept-3', name: 'Commercial', site_id: 'site-1', manager_id: 'emp-3' },
  { id: 'dept-4', name: 'Marketing', site_id: 'site-1', manager_id: 'emp-4' },
  { id: 'dept-5', name: 'Finance', site_id: 'site-1', manager_id: 'emp-5' },

  // TechCorp Marseille departments (site-2)
  { id: 'dept-6', name: 'Informatique', site_id: 'site-2', manager_id: 'emp-11' },
  { id: 'dept-7', name: 'Support Client', site_id: 'site-2', manager_id: 'emp-12' },
  { id: 'dept-8', name: 'Logistique', site_id: 'site-2', manager_id: 'emp-13' },

  // TechCorp Lyon departments (site-3)
  { id: 'dept-9', name: 'R&D', site_id: 'site-3', manager_id: 'emp-14' },
  { id: 'dept-10', name: 'Production', site_id: 'site-3', manager_id: 'emp-15' },
  { id: 'dept-11', name: 'Qualité', site_id: 'site-3', manager_id: 'emp-16' },

  // TechCorp Bordeaux departments (site-4)
  { id: 'dept-12', name: 'Commercial', site_id: 'site-4', manager_id: 'emp-17' },
  { id: 'dept-13', name: 'Marketing', site_id: 'site-4', manager_id: 'emp-18' },

  // TechCorp Lille departments (site-5)
  { id: 'dept-14', name: 'Informatique', site_id: 'site-5', manager_id: 'emp-19' },
  { id: 'dept-15', name: 'Administration', site_id: 'site-5', manager_id: 'emp-20' },

  // InnovateLab Lyon Central departments (site-6)
  { id: 'dept-16', name: 'R&D', site_id: 'site-6', manager_id: 'emp-21' },
  { id: 'dept-17', name: 'Innovation', site_id: 'site-6', manager_id: 'emp-22' },
  { id: 'dept-18', name: 'Projets', site_id: 'site-6', manager_id: 'emp-23' },

  // InnovateLab Grenoble departments (site-7)
  { id: 'dept-19', name: 'Recherche', site_id: 'site-7', manager_id: 'emp-24' },
  { id: 'dept-20', name: 'Développement', site_id: 'site-7', manager_id: 'emp-25' },

  // InnovateLab Toulouse departments (site-8)
  { id: 'dept-21', name: 'Innovation', site_id: 'site-8', manager_id: 'emp-22' },
  { id: 'dept-22', name: 'Prototypage', site_id: 'site-8', manager_id: 'emp-23' },

  // GlobalServices Paris 9e departments (site-9)
  { id: 'dept-23', name: 'Consulting', site_id: 'site-9', manager_id: 'emp-26' },
  { id: 'dept-24', name: 'Audit', site_id: 'site-9', manager_id: 'emp-27' },
  { id: 'dept-25', name: 'Direction', site_id: 'site-9', manager_id: 'emp-28' },

  // GlobalServices La Défense departments (site-10)
  { id: 'dept-26', name: 'Services Clients', site_id: 'site-10', manager_id: 'emp-29' },
  { id: 'dept-27', name: 'Support', site_id: 'site-10', manager_id: 'emp-30' },

  // GlobalServices Nantes departments (site-11)
  { id: 'dept-28', name: 'Commercial', site_id: 'site-11', manager_id: 'emp-26' },
  { id: 'dept-29', name: 'Marketing', site_id: 'site-11', manager_id: 'emp-27' },

  // GlobalServices Strasbourg departments (site-12)
  { id: 'dept-30', name: 'Ressources Humaines', site_id: 'site-12', manager_id: 'emp-28' },

  // DataTech Toulouse HQ departments (site-13)
  { id: 'dept-31', name: 'Data Science', site_id: 'site-13', manager_id: 'emp-21' },
  { id: 'dept-32', name: 'Analytics', site_id: 'site-13', manager_id: 'emp-24' },

  // DataTech Montpellier departments (site-14)
  { id: 'dept-33', name: 'Business Intelligence', site_id: 'site-14', manager_id: 'emp-25' },
];

/**
 * Export internal departments for other mocks to import
 */
export const mockDepartments = mockDepartmentsInternal;

/**
 * In-memory store
 */
let departmentsStore = [...mockDepartmentsInternal];

/**
 * Enrich department with related entities
 */
const enrichDepartment = (dept: DepartmentInternal): Department => {
  // Lazy imports to avoid circular dependencies
  const { mockSites } = require('./sites.mock');
  const { mockEmployees } = require('./employees.mock');

  const site = mockSites.find((s: any) => s.id === dept.site_id);
  const manager = dept.manager_id ? mockEmployees.find((e: any) => e.id === dept.manager_id) : null;
  const employees = mockEmployees.filter((e: any) => e.department_id === dept.id);

  return {
    id: dept.id,
    name: dept.name,
    site: site ? {
      id: site.id,
      name: site.name,
    } : null,
    manager: manager ? {
      id: manager.id,
      first_name: manager.first_name,
      last_name: manager.last_name,
      full_name: `${manager.first_name} ${manager.last_name}`,
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

  return paginate(enrichedDepts, pageToSkipLimit(page, page_size));
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

  const newDept: DepartmentInternal = {
    id: randomUUID(),
    name: data.name,
    site_id: data.site_id,
    manager_id: data.manager_id || null,
  };

  departmentsStore.push(newDept);
  return enrichDepartment(newDept);
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

  const updatedDept: DepartmentInternal = {
    ...departmentsStore[index],
    name: data.name !== undefined ? data.name : departmentsStore[index].name,
    site_id: data.site_id !== undefined ? data.site_id : departmentsStore[index].site_id,
    manager_id: data.manager_id !== undefined ? data.manager_id : departmentsStore[index].manager_id,
    id,
  };

  departmentsStore[index] = updatedDept;
  return enrichDepartment(updatedDept);
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
  departmentsStore = [...mockDepartmentsInternal];
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
