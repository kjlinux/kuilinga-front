import {
  readSitesApiV1SitesGet,
  readSiteApiV1SitesSiteIdGet,
  createSiteApiV1SitesPost,
  updateSiteApiV1SitesSiteIdPut,
  deleteSiteApiV1SitesSiteIdDelete,
} from "@/api";
import type {
  Site,
  SiteCreate,
  SiteUpdate,
  PaginatedResponseSite,
} from "@/api";

import type { PaginationParams } from "@/hooks/useDataTable";

class SiteService {
  async getSites(params: PaginationParams = {}): Promise<PaginatedResponseSite> {
    const response = await readSitesApiV1SitesGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });
    return response.data as PaginatedResponseSite;
  }

  async getSite(id: string): Promise<Site> {
    const response = await readSiteApiV1SitesSiteIdGet({
      path: { site_id: id },
    });
    return response.data as Site;
  }

  async createSite(data: SiteCreate): Promise<Site> {
    const response = await createSiteApiV1SitesPost({
      body: data,
    });
    return response.data as Site;
  }

  async updateSite(id: string, data: SiteUpdate): Promise<Site> {
    const response = await updateSiteApiV1SitesSiteIdPut({
      path: { site_id: id },
      body: data,
    });
    return response.data as Site;
  }

  async deleteSite(id: string): Promise<void> {
    await deleteSiteApiV1SitesSiteIdDelete({
      path: { site_id: id },
    });
  }
}

export default new SiteService();
