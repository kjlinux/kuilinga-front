/**
 * Employees Mock Data and Handlers
 */

import { Employee, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
import { randomUUID } from '../utils/generators';

/**
 * Generate employee number
 */
const generateEmployeeNumber = (index: number): string => {
  const year = 2023;
  const paddedIndex = String(index).padStart(4, '0');
  return `EMP${year}${paddedIndex}`;
};

/**
 * Internal employee structure (flat for easier management)
 */
interface EmployeeInternal {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  employee_number?: string | null;
  position?: string | null;
  badge_id?: string | null;
  department_id?: string | null;
  hire_date?: string;
  status: string;
}

/**
 * Initial mock employees data (internal structure)
 */
const mockEmployeesInternal: EmployeeInternal[] = [
  {
    id: 'emp-1',
    first_name: 'Abdoulaye',
    last_name: 'Ouédraogo',
    email: 'abdoulaye.ouedraogo@burkinatech.bf',
    phone: '+226 70 12 34 56',
    employee_number: 'EMP20230001',
    department_id: 'dept-1',
    position: 'Développeur Senior',
    hire_date: '2023-01-20',
    status: 'active',
  },
  {
    id: 'emp-2',
    first_name: 'Fatoumata',
    last_name: 'Sawadogo',
    email: 'fatoumata.sawadogo@burkinatech.bf',
    phone: '+226 70 23 45 67',
    employee_number: 'EMP20230002',
    department_id: 'dept-2',
    position: 'Responsable RH',
    hire_date: '2023-01-20',
    status: 'active',
  },
  {
    id: 'emp-3',
    first_name: 'Ousmane',
    last_name: 'Compaoré',
    email: 'ousmane.compaore@burkinatech.bf',
    phone: '+226 70 34 56 78',
    employee_number: 'EMP20230003',
    department_id: 'dept-3',
    position: 'Commercial Senior',
    hire_date: '2023-02-01',
    status: 'active',
  },
  {
    id: 'emp-4',
    first_name: 'Aminata',
    last_name: 'Traoré',
    email: 'aminata.traore@burkinatech.bf',
    phone: '+226 70 45 67 89',
    employee_number: 'EMP20230004',
    department_id: 'dept-4',
    position: 'Chef de Projet Marketing',
    hire_date: '2023-02-15',
    status: 'active',
  },
  {
    id: 'emp-5',
    first_name: 'Boureima',
    last_name: 'Kaboré',
    email: 'boureima.kabore@burkinatech.bf',
    phone: '+226 70 56 78 90',
    employee_number: 'EMP20230005',
    department_id: 'dept-5',
    position: 'Comptable',
    hire_date: '2023-03-01',
    status: 'active',
  },
  {
    id: 'emp-6',
    first_name: 'Mariam',
    last_name: 'Koné',
    email: 'mariam.kone@burkinatech.bf',
    phone: '+226 70 67 89 01',
    employee_number: 'EMP20230006',
    department_id: 'dept-1',
    position: 'Développeur Frontend',
    hire_date: '2023-03-15',
    status: 'active',
  },
  {
    id: 'emp-7',
    first_name: 'Seydou',
    last_name: 'Zoungrana',
    email: 'seydou.zoungrana@burkinatech.bf',
    phone: '+226 70 78 90 12',
    employee_number: 'EMP20230007',
    department_id: 'dept-1',
    position: 'Développeur Backend',
    hire_date: '2023-04-01',
    status: 'active',
  },
  {
    id: 'emp-8',
    first_name: 'Awa',
    last_name: 'Ouattara',
    email: 'awa.ouattara@burkinatech.bf',
    phone: '+226 70 89 01 23',
    employee_number: 'EMP20230008',
    department_id: 'dept-2',
    position: 'Assistant RH',
    hire_date: '2023-04-15',
    status: 'active',
  },
  {
    id: 'emp-9',
    first_name: 'Moussa',
    last_name: 'Sankara',
    email: 'moussa.sankara@burkinatech.bf',
    phone: '+226 70 90 12 34',
    employee_number: 'EMP20230009',
    department_id: 'dept-3',
    position: 'Commercial Junior',
    hire_date: '2023-05-01',
    status: 'active',
  },
  {
    id: 'emp-10',
    first_name: 'Sarata',
    last_name: 'Zongo',
    email: 'sarata.zongo@burkinatech.bf',
    phone: '+226 71 01 23 45',
    employee_number: 'EMP20230010',
    department_id: 'dept-4',
    position: 'Designer UX/UI',
    hire_date: '2023-05-15',
    status: 'active',
  },
  // Additional employees for other departments and sites
  {
    id: 'emp-11',
    first_name: 'Ibrahim',
    last_name: 'Diallo',
    email: 'ibrahim.diallo@burkinatech.bf',
    phone: '+226 71 12 34 56',
    employee_number: 'EMP20230011',
    department_id: 'dept-6',
    position: 'Chef de Projet IT',
    hire_date: '2023-06-01',
    status: 'active',
  },
  {
    id: 'emp-12',
    first_name: 'Aïssatou',
    last_name: 'Barry',
    email: 'aissatou.barry@burkinatech.bf',
    phone: '+226 71 23 45 67',
    employee_number: 'EMP20230012',
    department_id: 'dept-7',
    position: 'Support Technique',
    hire_date: '2023-06-15',
    status: 'active',
  },
  {
    id: 'emp-13',
    first_name: 'Issouf',
    last_name: 'Barro',
    email: 'issouf.barro@burkinatech.bf',
    phone: '+226 71 34 56 78',
    employee_number: 'EMP20230013',
    department_id: 'dept-8',
    position: 'Responsable Logistique',
    hire_date: '2023-07-01',
    status: 'active',
  },
  {
    id: 'emp-14',
    first_name: 'Rasmata',
    last_name: 'Kinda',
    email: 'rasmata.kinda@burkinatech.bf',
    phone: '+226 71 45 67 89',
    employee_number: 'EMP20230014',
    department_id: 'dept-9',
    position: 'Chercheur R&D',
    hire_date: '2023-07-15',
    status: 'active',
  },
  {
    id: 'emp-15',
    first_name: 'Hamidou',
    last_name: 'Tapsoba',
    email: 'hamidou.tapsoba@burkinatech.bf',
    phone: '+226 71 56 78 90',
    employee_number: 'EMP20230015',
    department_id: 'dept-10',
    position: 'Ingénieur Production',
    hire_date: '2023-08-01',
    status: 'active',
  },
  {
    id: 'emp-16',
    first_name: 'Rakieta',
    last_name: 'Nacoulma',
    email: 'rakieta.nacoulma@burkinatech.bf',
    phone: '+226 71 67 89 01',
    employee_number: 'EMP20230016',
    department_id: 'dept-11',
    position: 'Responsable Qualité',
    hire_date: '2023-08-15',
    status: 'active',
  },
  {
    id: 'emp-17',
    first_name: 'Souleymane',
    last_name: 'Ilboudo',
    email: 'souleymane.ilboudo@burkinatech.bf',
    phone: '+226 71 78 90 12',
    employee_number: 'EMP20230017',
    department_id: 'dept-12',
    position: 'Directeur Commercial',
    hire_date: '2023-09-01',
    status: 'active',
  },
  {
    id: 'emp-18',
    first_name: 'Hawa',
    last_name: 'Kéré',
    email: 'hawa.kere@burkinatech.bf',
    phone: '+226 71 89 01 23',
    employee_number: 'EMP20230018',
    department_id: 'dept-13',
    position: 'Chef de Produit',
    hire_date: '2023-09-15',
    status: 'active',
  },
  {
    id: 'emp-19',
    first_name: 'Karim',
    last_name: 'Sana',
    email: 'karim.sana@burkinatech.bf',
    phone: '+226 71 90 12 34',
    employee_number: 'EMP20230019',
    department_id: 'dept-14',
    position: 'Administrateur Système',
    hire_date: '2023-10-01',
    status: 'active',
  },
  {
    id: 'emp-20',
    first_name: 'Zenabo',
    last_name: 'Tao',
    email: 'zenabo.tao@burkinatech.bf',
    phone: '+226 72 01 23 45',
    employee_number: 'EMP20230020',
    department_id: 'dept-15',
    position: 'Assistante Administrative',
    hire_date: '2023-10-15',
    status: 'active',
  },
  // Faso Innovation employees
  {
    id: 'emp-21',
    first_name: 'Amadou',
    last_name: 'Sorgho',
    email: 'amadou.sorgho@fasoinnovation.bf',
    phone: '+226 72 12 34 56',
    employee_number: 'EMP20230021',
    department_id: 'dept-16',
    position: 'Directeur R&D',
    hire_date: '2023-03-25',
    status: 'active',
  },
  {
    id: 'emp-22',
    first_name: 'Safiatou',
    last_name: 'Nikiema',
    email: 'safiatou.nikiema@fasoinnovation.bf',
    phone: '+226 72 23 45 67',
    employee_number: 'EMP20230022',
    department_id: 'dept-17',
    position: 'Innovation Manager',
    hire_date: '2023-04-10',
    status: 'active',
  },
  {
    id: 'emp-23',
    first_name: 'Rasmané',
    last_name: 'Yé',
    email: 'rasmane.ye@fasoinnovation.bf',
    phone: '+226 72 34 56 78',
    employee_number: 'EMP20230023',
    department_id: 'dept-18',
    position: 'Chef de Projet',
    hire_date: '2023-05-05',
    status: 'active',
  },
  {
    id: 'emp-24',
    first_name: 'Maïmouna',
    last_name: 'Kaboré',
    email: 'maimouna.kabore@fasoinnovation.bf',
    phone: '+226 72 45 67 89',
    employee_number: 'EMP20230024',
    department_id: 'dept-19',
    position: 'Chercheur Senior',
    hire_date: '2023-05-20',
    status: 'active',
  },
  {
    id: 'emp-25',
    first_name: 'Yacouba',
    last_name: 'Traoré',
    email: 'yacouba.traore@fasoinnovation.bf',
    phone: '+226 72 56 78 90',
    employee_number: 'EMP20230025',
    department_id: 'dept-20',
    position: 'Développeur Full Stack',
    hire_date: '2023-06-05',
    status: 'active',
  },
  // Sahel Services employees
  {
    id: 'emp-26',
    first_name: 'Salamata',
    last_name: 'Ouattara',
    email: 'salamata.ouattara@sahelservices.bf',
    phone: '+226 72 67 89 01',
    employee_number: 'EMP20220026',
    department_id: 'dept-23',
    position: 'Consultant Senior',
    hire_date: '2022-11-15',
    status: 'active',
  },
  {
    id: 'emp-27',
    first_name: 'Zakaria',
    last_name: 'Compaoré',
    email: 'zakaria.compaore@sahelservices.bf',
    phone: '+226 72 78 90 12',
    employee_number: 'EMP20220027',
    department_id: 'dept-24',
    position: 'Auditeur',
    hire_date: '2022-12-01',
    status: 'active',
  },
  {
    id: 'emp-28',
    first_name: 'Asseta',
    last_name: 'Sawadogo',
    email: 'asseta.sawadogo@sahelservices.bf',
    phone: '+226 72 89 01 23',
    employee_number: 'EMP20230028',
    department_id: 'dept-25',
    position: 'Directrice Générale',
    hire_date: '2023-01-15',
    status: 'active',
  },
  {
    id: 'emp-29',
    first_name: 'Boubacar',
    last_name: 'Diallo',
    email: 'boubacar.diallo@sahelservices.bf',
    phone: '+226 72 90 12 34',
    employee_number: 'EMP20230029',
    department_id: 'dept-26',
    position: 'Responsable Service Client',
    hire_date: '2023-02-01',
    status: 'active',
  },
  {
    id: 'emp-30',
    first_name: 'Bibata',
    last_name: 'Zoungrana',
    email: 'bibata.zoungrana@sahelservices.bf',
    phone: '+226 73 01 23 45',
    employee_number: 'EMP20230030',
    department_id: 'dept-27',
    position: 'Support Technique',
    hire_date: '2023-02-15',
    status: 'active',
  },
];

/**
 * Export internal employees for other mocks to import
 */
export const mockEmployees = mockEmployeesInternal;

/**
 * In-memory store
 */
let employeesStore = [...mockEmployeesInternal];

/**
 * Enrich employee with related entities
 */
const enrichEmployee = (emp: EmployeeInternal): Employee => {
  // Lazy imports to avoid circular dependencies
  const { mockDepartments } = require('./departments.mock');
  const { mockSites } = require('./sites.mock');
  const { mockOrganizations } = require('./organizations.mock');

  const department = emp.department_id ? mockDepartments.find((d: any) => d.id === emp.department_id) : null;
  const site = department ? mockSites.find((s: any) => s.id === department.site_id) : null;
  const organization = site ? mockOrganizations.find((o: any) => o.id === site.organization_id) : null;

  return {
    id: emp.id,
    first_name: emp.first_name,
    last_name: emp.last_name,
    email: emp.email,
    phone: emp.phone || null,
    employee_number: emp.employee_number || null,
    position: emp.position || null,
    badge_id: emp.badge_id || null,
    status: emp.status,
    department: department ? {
      id: department.id,
      name: department.name,
    } : null,
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
    user: null,
  };
};

/**
 * GET /api/v1/employees
 */
export const getEmployeesHandler = (request: any): PaginatedResponse<Employee> => {
  const { page, page_size, search, department_id, status } = request.query;

  let filteredEmployees = [...employeesStore];

  if (search) {
    filteredEmployees = filterBySearch(filteredEmployees, search, [
      'first_name',
      'last_name',
      'email',
      'employee_number',
      'position',
    ]);
  }

  if (department_id) {
    filteredEmployees = filteredEmployees.filter(e => e.department_id === department_id);
  }

  if (status !== undefined) {
    filteredEmployees = filteredEmployees.filter(e => e.status === status);
  }

  const enrichedEmployees = filteredEmployees.map(enrichEmployee);

  return paginate(enrichedEmployees, pageToSkipLimit(page, page_size));
};

/**
 * GET /api/v1/employees/:id
 */
export const getEmployeeByIdHandler = (request: any): Employee => {
  const { id } = request.params;
  const employee = employeesStore.find(e => e.id === id);

  if (!employee) {
    throw createMockError(404, { detail: 'Employee not found' });
  }

  return enrichEmployee(employee);
};

/**
 * POST /api/v1/employees
 */
export const createEmployeeHandler = (request: any): Employee => {
  const data = request.body;

  if (!data.first_name || !data.last_name || !data.email) {
    throw createMockError(422, {
      detail: [{ loc: ['body'], msg: 'first_name, last_name, and email are required', type: 'value_error.missing' }],
    });
  }

  if (employeesStore.some(e => e.email === data.email)) {
    throw createMockError(400, { detail: 'Email already exists' });
  }

  const newEmployee: EmployeeInternal = {
    id: randomUUID(),
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || null,
    employee_number: data.employee_number || generateEmployeeNumber(employeesStore.length + 1),
    department_id: data.department_id || null,
    position: data.position || null,
    badge_id: data.badge_id || null,
    hire_date: data.hire_date || new Date().toISOString().split('T')[0],
    status: data.status || 'active',
  };

  employeesStore.push(newEmployee);
  return enrichEmployee(newEmployee);
};

/**
 * PUT /api/v1/employees/:id
 */
export const updateEmployeeHandler = (request: any): Employee => {
  const { id } = request.params;
  const data = request.body;

  const index = employeesStore.findIndex(e => e.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Employee not found' });
  }

  if (data.email && data.email !== employeesStore[index].email) {
    if (employeesStore.some(e => e.email === data.email && e.id !== id)) {
      throw createMockError(400, { detail: 'Email already exists' });
    }
  }

  const updatedEmployee: EmployeeInternal = {
    ...employeesStore[index],
    first_name: data.first_name !== undefined ? data.first_name : employeesStore[index].first_name,
    last_name: data.last_name !== undefined ? data.last_name : employeesStore[index].last_name,
    email: data.email !== undefined ? data.email : employeesStore[index].email,
    phone: data.phone !== undefined ? data.phone : employeesStore[index].phone,
    employee_number: data.employee_number !== undefined ? data.employee_number : employeesStore[index].employee_number,
    position: data.position !== undefined ? data.position : employeesStore[index].position,
    badge_id: data.badge_id !== undefined ? data.badge_id : employeesStore[index].badge_id,
    department_id: data.department_id !== undefined ? data.department_id : employeesStore[index].department_id,
    hire_date: data.hire_date !== undefined ? data.hire_date : employeesStore[index].hire_date,
    status: data.status !== undefined ? data.status : employeesStore[index].status,
    id,
  };

  employeesStore[index] = updatedEmployee;
  return enrichEmployee(updatedEmployee);
};

/**
 * DELETE /api/v1/employees/:id
 */
export const deleteEmployeeHandler = (request: any): void => {
  const { id } = request.params;

  const index = employeesStore.findIndex(e => e.id === id);
  if (index === -1) {
    throw createMockError(404, { detail: 'Employee not found' });
  }

  employeesStore.splice(index, 1);
};

/**
 * POST /api/v1/employees/import
 */
export const importEmployeesHandler = (request: any): { imported: number; failed: number } => {
  // Mock implementation - just return success
  const data = request.body;
  const count = data?.employees?.length || 0;

  return {
    imported: count,
    failed: 0,
  };
};

/**
 * Reset employees store
 */
export const resetEmployeesStore = () => {
  employeesStore = [...mockEmployeesInternal];
};

/**
 * Export employee handlers
 */
export const employeeHandlers = [
  {
    method: 'GET',
    pattern: '/api/v1/employees',
    handler: getEmployeesHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/employees/:id',
    handler: getEmployeeByIdHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/employees',
    handler: createEmployeeHandler,
  },
  {
    method: 'PUT',
    pattern: '/api/v1/employees/:id',
    handler: updateEmployeeHandler,
  },
  {
    method: 'DELETE',
    pattern: '/api/v1/employees/:id',
    handler: deleteEmployeeHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/employees/import',
    handler: importEmployeesHandler,
  },
];
