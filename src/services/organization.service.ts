import {
  readOrganizationsApiV1OrganizationsGet,
  readOrganizationApiV1OrganizationsOrgIdGet,
  createOrganizationApiV1OrganizationsPost,
  updateOrganizationApiV1OrganizationsOrgIdPut,
  deleteOrganizationApiV1OrganizationsOrgIdDelete,
} from "@/api";
import type {
  Organization,
  OrganizationCreate,
  OrganizationUpdate,
  PaginatedResponseOrganization,
} from "@/api";

import type { PaginationParams } from "@/hooks/useDataTable";

class OrganizationService {
  async getOrganizations(params: PaginationParams = {}): Promise<PaginatedResponseOrganization> {
    const response = await readOrganizationsApiV1OrganizationsGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });
    return response.data as PaginatedResponseOrganization;
  }

  async getOrganization(id: string): Promise<Organization> {
    const response = await readOrganizationApiV1OrganizationsOrgIdGet({
      path: { org_id: id },
    });
    return response.data as Organization;
  }

  async createOrganization(data: OrganizationCreate): Promise<Organization> {
    const response = await createOrganizationApiV1OrganizationsPost({
      body: data,
    });
    return response.data as Organization;
  }

  async updateOrganization(id: string, data: OrganizationUpdate): Promise<Organization> {
    const response = await updateOrganizationApiV1OrganizationsOrgIdPut({
      path: { org_id: id },
      body: data,
    });
    return response.data as Organization;
  }

  async deleteOrganization(id: string): Promise<void> {
    await deleteOrganizationApiV1OrganizationsOrgIdDelete({
      path: { org_id: id },
    });
  }
}

export default new OrganizationService();
