import {
  readDepartmentsApiV1DepartmentsGet,
  readDepartmentApiV1DepartmentsDepartmentIdGet,
  createDepartmentApiV1DepartmentsPost,
  updateDepartmentApiV1DepartmentsDepartmentIdPut,
  deleteDepartmentApiV1DepartmentsDepartmentIdDelete,
} from "@/api";
import type {
  Department,
  DepartmentCreate,
  DepartmentUpdate,
  PaginatedResponseDepartment,
} from "@/api";

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

class DepartmentService {
  async getDepartments(params: PaginationParams = {}): Promise<PaginatedResponseDepartment> {
    const response = await readDepartmentsApiV1DepartmentsGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
      },
    });
    return response.data as PaginatedResponseDepartment;
  }

  async getDepartment(id: string): Promise<Department> {
    const response = await readDepartmentApiV1DepartmentsDepartmentIdGet({
      path: { department_id: id },
    });
    return response.data as Department;
  }

  async createDepartment(data: DepartmentCreate): Promise<Department> {
    const response = await createDepartmentApiV1DepartmentsPost({
      body: data,
    });
    return response.data as Department;
  }

  async updateDepartment(id: string, data: DepartmentUpdate): Promise<Department> {
    const response = await updateDepartmentApiV1DepartmentsDepartmentIdPut({
      path: { department_id: id },
      body: data,
    });
    return response.data as Department;
  }

  async deleteDepartment(id: string): Promise<void> {
    await deleteDepartmentApiV1DepartmentsDepartmentIdDelete({
      path: { department_id: id },
    });
  }
}

export default new DepartmentService();
