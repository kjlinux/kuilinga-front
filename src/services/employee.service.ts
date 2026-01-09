import {
  readEmployeesApiV1EmployeesGet,
  readEmployeeApiV1EmployeesEmployeeIdGet,
  createEmployeeApiV1EmployeesPost,
  updateEmployeeApiV1EmployeesEmployeeIdPut,
  deleteEmployeeApiV1EmployeesEmployeeIdDelete,
} from "@/api";
import type {
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
  PaginatedResponseEmployee,
} from "@/api";

import type { PaginationParams } from "@/hooks/useDataTable";

class EmployeeService {
  async getEmployees(params: PaginationParams = {}): Promise<PaginatedResponseEmployee> {
    const response = await readEmployeesApiV1EmployeesGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });
    return response.data as PaginatedResponseEmployee;
  }

  async getEmployee(id: string): Promise<Employee> {
    const response = await readEmployeeApiV1EmployeesEmployeeIdGet({
      path: { employee_id: id },
    });
    return response.data as Employee;
  }

  async createEmployee(data: EmployeeCreate): Promise<Employee> {
    const response = await createEmployeeApiV1EmployeesPost({
      body: data,
    });
    return response.data as Employee;
  }

  async updateEmployee(id: string, data: EmployeeUpdate): Promise<Employee> {
    const response = await updateEmployeeApiV1EmployeesEmployeeIdPut({
      path: { employee_id: id },
      body: data,
    });
    return response.data as Employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await deleteEmployeeApiV1EmployeesEmployeeIdDelete({
      path: { employee_id: id },
    });
  }
}

export default new EmployeeService();
