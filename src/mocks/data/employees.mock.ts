/**
 * Employees Mock Data and Handlers
 */

import { Employee, PaginatedResponse } from '../../types';
import { createMockError } from '../interceptor';
import { paginate, filterBySearch } from '../utils/pagination';
import { randomUUID, randomFrenchName, randomEmail, randomPhone, randomElement, randomDate } from '../utils/generators';
import { mockDepartments } from './departments.mock';
import { mockSites } from './sites.mock';
import { mockOrganizations } from './organizations.mock';

/**
 * Generate employee registration number
 */
const generateRegistrationNumber = (index: number): string => {
  const year = 2023;
  const paddedIndex = String(index).padStart(4, '0');
  return `EMP${year}${paddedIndex}`;
};

/**
 * Initial mock employees data
 */
export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    first_name: 'Abdoulaye',
    last_name: 'Ouédraogo',
    email: 'abdoulaye.ouedraogo@burkinatech.bf',
    phone_number: '+226 70 12 34 56',
    registration_number: 'EMP20230001',
    department_id: 'dept-1',
    job_title: 'Développeur Senior',
    hire_date: '2023-01-20',
    is_active: true,
    created_at: '2023-01-20T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-2',
    first_name: 'Fatoumata',
    last_name: 'Sawadogo',
    email: 'fatoumata.sawadogo@burkinatech.bf',
    phone_number: '+226 70 23 45 67',
    registration_number: 'EMP20230002',
    department_id: 'dept-2',
    job_title: 'Responsable RH',
    hire_date: '2023-01-20',
    is_active: true,
    created_at: '2023-01-20T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-3',
    first_name: 'Ousmane',
    last_name: 'Compaoré',
    email: 'ousmane.compaore@burkinatech.bf',
    phone_number: '+226 70 34 56 78',
    registration_number: 'EMP20230003',
    department_id: 'dept-3',
    job_title: 'Commercial Senior',
    hire_date: '2023-02-01',
    is_active: true,
    created_at: '2023-02-01T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-4',
    first_name: 'Aminata',
    last_name: 'Traoré',
    email: 'aminata.traore@burkinatech.bf',
    phone_number: '+226 70 45 67 89',
    registration_number: 'EMP20230004',
    department_id: 'dept-4',
    job_title: 'Chef de Projet Marketing',
    hire_date: '2023-02-15',
    is_active: true,
    created_at: '2023-02-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-5',
    first_name: 'Boureima',
    last_name: 'Kaboré',
    email: 'boureima.kabore@burkinatech.bf',
    phone_number: '+226 70 56 78 90',
    registration_number: 'EMP20230005',
    department_id: 'dept-5',
    job_title: 'Comptable',
    hire_date: '2023-03-01',
    is_active: true,
    created_at: '2023-03-01T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-6',
    first_name: 'Mariam',
    last_name: 'Koné',
    email: 'mariam.kone@burkinatech.bf',
    phone_number: '+226 70 67 89 01',
    registration_number: 'EMP20230006',
    department_id: 'dept-1',
    job_title: 'Développeur Frontend',
    hire_date: '2023-03-15',
    is_active: true,
    created_at: '2023-03-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-7',
    first_name: 'Seydou',
    last_name: 'Zoungrana',
    email: 'seydou.zoungrana@burkinatech.bf',
    phone_number: '+226 70 78 90 12',
    registration_number: 'EMP20230007',
    department_id: 'dept-1',
    job_title: 'Développeur Backend',
    hire_date: '2023-04-01',
    is_active: true,
    created_at: '2023-04-01T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-8',
    first_name: 'Awa',
    last_name: 'Ouattara',
    email: 'awa.ouattara@burkinatech.bf',
    phone_number: '+226 70 89 01 23',
    registration_number: 'EMP20230008',
    department_id: 'dept-2',
    job_title: 'Assistant RH',
    hire_date: '2023-04-15',
    is_active: true,
    created_at: '2023-04-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-9',
    first_name: 'Moussa',
    last_name: 'Sankara',
    email: 'moussa.sankara@burkinatech.bf',
    phone_number: '+226 70 90 12 34',
    registration_number: 'EMP20230009',
    department_id: 'dept-3',
    job_title: 'Commercial Junior',
    hire_date: '2023-05-01',
    is_active: true,
    created_at: '2023-05-01T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: 'emp-10',
    first_name: 'Sarata',
    last_name: 'Zongo',
    email: 'sarata.zongo@burkinatech.bf',
    phone_number: '+226 71 01 23 45',
    registration_number: 'EMP20230010',
    department_id: 'dept-4',
    job_title: 'Designer UX/UI',
    hire_date: '2023-05-15',
    is_active: true,
    created_at: '2023-05-15T10:00:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  // Additional employees for other departments and sites
  {
    id: 'emp-11',
    first_name: 'Ibrahim',
    last_name: 'Diallo',
    email: 'ibrahim.diallo@burkinatech.bf',
    phone_number: '+226 71 12 34 56',
    registration_number: 'EMP20230011',
    department_id: 'dept-6',
    job_title: 'Chef de Projet IT',
    hire_date: '2023-06-01',
    is_active: true,
    created_at: '2023-06-01T10:00:00Z',
    updated_at: '2024-10-20T09:15:00Z',
  },
  {
    id: 'emp-12',
    first_name: 'Aïssatou',
    last_name: 'Barry',
    email: 'aissatou.barry@burkinatech.bf',
    phone_number: '+226 71 23 45 67',
    registration_number: 'EMP20230012',
    department_id: 'dept-7',
    job_title: 'Support Technique',
    hire_date: '2023-06-15',
    is_active: true,
    created_at: '2023-06-15T10:00:00Z',
    updated_at: '2024-10-20T09:15:00Z',
  },
  {
    id: 'emp-13',
    first_name: 'Issouf',
    last_name: 'Barro',
    email: 'issouf.barro@burkinatech.bf',
    phone_number: '+226 71 34 56 78',
    registration_number: 'EMP20230013',
    department_id: 'dept-8',
    job_title: 'Responsable Logistique',
    hire_date: '2023-07-01',
    is_active: true,
    created_at: '2023-07-01T10:00:00Z',
    updated_at: '2024-10-20T09:15:00Z',
  },
  {
    id: 'emp-14',
    first_name: 'Rasmata',
    last_name: 'Kinda',
    email: 'rasmata.kinda@burkinatech.bf',
    phone_number: '+226 71 45 67 89',
    registration_number: 'EMP20230014',
    department_id: 'dept-9',
    job_title: 'Chercheur R&D',
    hire_date: '2023-07-15',
    is_active: true,
    created_at: '2023-07-15T10:00:00Z',
    updated_at: '2024-10-25T16:00:00Z',
  },
  {
    id: 'emp-15',
    first_name: 'Hamidou',
    last_name: 'Tapsoba',
    email: 'hamidou.tapsoba@burkinatech.bf',
    phone_number: '+226 71 56 78 90',
    registration_number: 'EMP20230015',
    department_id: 'dept-10',
    job_title: 'Ingénieur Production',
    hire_date: '2023-08-01',
    is_active: true,
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2024-10-25T16:00:00Z',
  },
  {
    id: 'emp-16',
    first_name: 'Rakieta',
    last_name: 'Nacoulma',
    email: 'rakieta.nacoulma@burkinatech.bf',
    phone_number: '+226 71 67 89 01',
    registration_number: 'EMP20230016',
    department_id: 'dept-11',
    job_title: 'Responsable Qualité',
    hire_date: '2023-08-15',
    is_active: true,
    created_at: '2023-08-15T10:00:00Z',
    updated_at: '2024-10-25T16:00:00Z',
  },
  {
    id: 'emp-17',
    first_name: 'Souleymane',
    last_name: 'Ilboudo',
    email: 'souleymane.ilboudo@burkinatech.bf',
    phone_number: '+226 71 78 90 12',
    registration_number: 'EMP20230017',
    department_id: 'dept-12',
    job_title: 'Directeur Commercial',
    hire_date: '2023-09-01',
    is_active: true,
    created_at: '2023-09-01T10:00:00Z',
    updated_at: '2024-11-03T11:20:00Z',
  },
  {
    id: 'emp-18',
    first_name: 'Hawa',
    last_name: 'Kéré',
    email: 'hawa.kere@burkinatech.bf',
    phone_number: '+226 71 89 01 23',
    registration_number: 'EMP20230018',
    department_id: 'dept-13',
    job_title: 'Chef de Produit',
    hire_date: '2023-09-15',
    is_active: true,
    created_at: '2023-09-15T10:00:00Z',
    updated_at: '2024-11-03T11:20:00Z',
  },
  {
    id: 'emp-19',
    first_name: 'Karim',
    last_name: 'Sana',
    email: 'karim.sana@burkinatech.bf',
    phone_number: '+226 71 90 12 34',
    registration_number: 'EMP20230019',
    department_id: 'dept-14',
    job_title: 'Administrateur Système',
    hire_date: '2023-10-01',
    is_active: true,
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2024-10-30T13:45:00Z',
  },
  {
    id: 'emp-20',
    first_name: 'Zenabo',
    last_name: 'Tao',
    email: 'zenabo.tao@burkinatech.bf',
    phone_number: '+226 72 01 23 45',
    registration_number: 'EMP20230020',
    department_id: 'dept-15',
    job_title: 'Assistante Administrative',
    hire_date: '2023-10-15',
    is_active: true,
    created_at: '2023-10-15T10:00:00Z',
    updated_at: '2024-10-30T13:45:00Z',
  },
  // Faso Innovation employees
  {
    id: 'emp-21',
    first_name: 'Amadou',
    last_name: 'Sorgho',
    email: 'amadou.sorgho@fasoinnovation.bf',
    phone_number: '+226 72 12 34 56',
    registration_number: 'EMP20230021',
    department_id: 'dept-16',
    job_title: 'Directeur R&D',
    hire_date: '2023-03-25',
    is_active: true,
    created_at: '2023-03-25T10:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'emp-22',
    first_name: 'Safiatou',
    last_name: 'Nikiema',
    email: 'safiatou.nikiema@fasoinnovation.bf',
    phone_number: '+226 72 23 45 67',
    registration_number: 'EMP20230022',
    department_id: 'dept-17',
    job_title: 'Innovation Manager',
    hire_date: '2023-04-10',
    is_active: true,
    created_at: '2023-04-10T10:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'emp-23',
    first_name: 'Rasmané',
    last_name: 'Yé',
    email: 'rasmane.ye@fasoinnovation.bf',
    phone_number: '+226 72 34 56 78',
    registration_number: 'EMP20230023',
    department_id: 'dept-18',
    job_title: 'Chef de Projet',
    hire_date: '2023-05-05',
    is_active: true,
    created_at: '2023-05-05T10:00:00Z',
    updated_at: '2024-10-15T16:45:00Z',
  },
  {
    id: 'emp-24',
    first_name: 'Maïmouna',
    last_name: 'Kaboré',
    email: 'maimouna.kabore@fasoinnovation.bf',
    phone_number: '+226 72 45 67 89',
    registration_number: 'EMP20230024',
    department_id: 'dept-19',
    job_title: 'Chercheur Senior',
    hire_date: '2023-05-20',
    is_active: true,
    created_at: '2023-05-20T10:00:00Z',
    updated_at: '2024-10-22T14:00:00Z',
  },
  {
    id: 'emp-25',
    first_name: 'Yacouba',
    last_name: 'Traoré',
    email: 'yacouba.traore@fasoinnovation.bf',
    phone_number: '+226 72 56 78 90',
    registration_number: 'EMP20230025',
    department_id: 'dept-20',
    job_title: 'Développeur Full Stack',
    hire_date: '2023-06-05',
    is_active: true,
    created_at: '2023-06-05T10:00:00Z',
    updated_at: '2024-10-22T14:00:00Z',
  },
  // Sahel Services employees
  {
    id: 'emp-26',
    first_name: 'Salamata',
    last_name: 'Ouattara',
    email: 'salamata.ouattara@sahelservices.bf',
    phone_number: '+226 72 67 89 01',
    registration_number: 'EMP20220026',
    department_id: 'dept-23',
    job_title: 'Consultant Senior',
    hire_date: '2022-11-15',
    is_active: true,
    created_at: '2022-11-15T10:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'emp-27',
    first_name: 'Zakaria',
    last_name: 'Compaoré',
    email: 'zakaria.compaore@sahelservices.bf',
    phone_number: '+226 72 78 90 12',
    registration_number: 'EMP20220027',
    department_id: 'dept-24',
    job_title: 'Auditeur',
    hire_date: '2022-12-01',
    is_active: true,
    created_at: '2022-12-01T10:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'emp-28',
    first_name: 'Asseta',
    last_name: 'Sawadogo',
    email: 'asseta.sawadogo@sahelservices.bf',
    phone_number: '+226 72 89 01 23',
    registration_number: 'EMP20230028',
    department_id: 'dept-25',
    job_title: 'Directrice Générale',
    hire_date: '2023-01-15',
    is_active: true,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2024-11-05T10:20:00Z',
  },
  {
    id: 'emp-29',
    first_name: 'Boubacar',
    last_name: 'Diallo',
    email: 'boubacar.diallo@sahelservices.bf',
    phone_number: '+226 72 90 12 34',
    registration_number: 'EMP20230029',
    department_id: 'dept-26',
    job_title: 'Responsable Service Client',
    hire_date: '2023-02-01',
    is_active: true,
    created_at: '2023-02-01T10:00:00Z',
    updated_at: '2024-10-18T15:30:00Z',
  },
  {
    id: 'emp-30',
    first_name: 'Bibata',
    last_name: 'Zoungrana',
    email: 'bibata.zoungrana@sahelservices.bf',
    phone_number: '+226 73 01 23 45',
    registration_number: 'EMP20230030',
    department_id: 'dept-27',
    job_title: 'Support Technique',
    hire_date: '2023-02-15',
    is_active: true,
    created_at: '2023-02-15T10:00:00Z',
    updated_at: '2024-10-18T15:30:00Z',
  },
];

/**
 * In-memory store
 */
let employeesStore = [...mockEmployees];

/**
 * Enrich employee with related entities
 */
const enrichEmployee = (emp: Employee): any => {
  const department = emp.department_id ? mockDepartments.find(d => d.id === emp.department_id) : null;
  const site = department ? mockSites.find(s => s.id === department.site_id) : null;
  const organization = site ? mockOrganizations.find(o => o.id === site.organization_id) : null;

  return {
    ...emp,
    full_name: `${emp.first_name} ${emp.last_name}`,
    department: department ? {
      id: department.id,
      name: department.name,
      site_id: department.site_id,
    } : null,
    site: site ? {
      id: site.id,
      name: site.name,
      organization_id: site.organization_id,
    } : null,
    organization: organization ? {
      id: organization.id,
      name: organization.name,
    } : null,
    badge_id: emp.registration_number,
  };
};

/**
 * GET /api/v1/employees
 */
export const getEmployeesHandler = (request: any): PaginatedResponse<Employee> => {
  const { page, page_size, search, department_id, is_active } = request.query;

  let filteredEmployees = [...employeesStore];

  if (search) {
    filteredEmployees = filterBySearch(filteredEmployees, search, [
      'first_name',
      'last_name',
      'email',
      'registration_number',
      'job_title',
    ]);
  }

  if (department_id) {
    filteredEmployees = filteredEmployees.filter(e => e.department_id === department_id);
  }

  if (is_active !== undefined) {
    filteredEmployees = filteredEmployees.filter(e => e.is_active === (is_active === 'true'));
  }

  const enrichedEmployees = filteredEmployees.map(enrichEmployee);

  return paginate(enrichedEmployees, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });
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

  const now = new Date().toISOString();
  const newEmployee: Employee = {
    id: randomUUID(),
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone_number: data.phone_number || null,
    registration_number: data.registration_number || generateRegistrationNumber(employeesStore.length + 1),
    department_id: data.department_id || null,
    job_title: data.job_title || null,
    hire_date: data.hire_date || new Date().toISOString().split('T')[0],
    is_active: data.is_active !== undefined ? data.is_active : true,
    created_at: now,
    updated_at: now,
  };

  employeesStore.push(newEmployee);
  return newEmployee;
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

  const updatedEmployee: Employee = {
    ...employeesStore[index],
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  employeesStore[index] = updatedEmployee;
  return updatedEmployee;
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
  employeesStore = [...mockEmployees];
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
