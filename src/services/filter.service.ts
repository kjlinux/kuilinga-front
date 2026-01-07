import {
  readRolesApiV1RolesGet,
  readOrganizationsApiV1OrganizationsGet,
  readSitesApiV1SitesGet,
  readDepartmentsApiV1DepartmentsGet,
  readEmployeesApiV1EmployeesGet,
} from "@/api";
import type {
  Organization,
  Site,
  Department,
  Employee,
  Role,
  PaginatedResponseRole,
  PaginatedResponseOrganization,
  PaginatedResponseSite,
  PaginatedResponseDepartment,
  PaginatedResponseEmployee,
} from "@/api";

class FilterService {
  async getRoles(): Promise<Role[]> {
    const response = await readRolesApiV1RolesGet({
      query: { skip: 0, limit: 1000 },
    });
    return (response.data as PaginatedResponseRole).items;
  }

  async getOrganizations(): Promise<Organization[]> {
    const response = await readOrganizationsApiV1OrganizationsGet({
      query: { skip: 0, limit: 1000 },
    });
    return (response.data as PaginatedResponseOrganization).items;
  }

  async getSites(organizationId: string): Promise<Site[]> {
    // The API does not support filtering sites by organization, so we fetch all and filter client-side.
    // This is not ideal, but it's a workaround until the API is updated.
    const response = await readSitesApiV1SitesGet({
      query: { skip: 0, limit: 1000 },
    });
    const sites = (response.data as PaginatedResponseSite).items;
    return sites.filter(site => site.organization?.id === organizationId);
  }

  async getDepartments(siteId: string): Promise<Department[]> {
    // The API does not support filtering departments by site, so we fetch all and filter client-side.
    const response = await readDepartmentsApiV1DepartmentsGet({
      query: { skip: 0, limit: 1000 },
    });
    const departments = (response.data as PaginatedResponseDepartment).items;
    return departments.filter(dept => dept.site?.id === siteId);
  }

  async getEmployees(departmentId: string): Promise<Employee[]> {
    // The API does not support filtering employees by department, so we fetch all and filter client-side.
    const response = await readEmployeesApiV1EmployeesGet({
      query: { skip: 0, limit: 1000 },
    });
    const employees = (response.data as PaginatedResponseEmployee).items;
    return employees.filter(emp => emp.department?.id === departmentId);
  }
}

export default new FilterService();
