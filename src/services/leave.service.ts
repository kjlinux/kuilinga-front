import {
  readLeavesApiV1LeavesGet,
  readLeaveApiV1LeavesLeaveIdGet,
  createLeaveApiV1LeavesPost,
  updateLeaveApiV1LeavesLeaveIdPut,
  deleteLeaveApiV1LeavesLeaveIdDelete,
} from "@/api";
import type {
  Leave,
  LeaveCreate,
  LeaveUpdate,
  PaginatedResponseLeave,
} from "@/api";

import type { PaginationParams } from "@/hooks/useDataTable";

class LeaveService {
  async getLeaves(params: PaginationParams = {}): Promise<PaginatedResponseLeave> {
    const response = await readLeavesApiV1LeavesGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });
    return response.data as PaginatedResponseLeave;
  }

  async getLeave(id: string): Promise<Leave> {
    const response = await readLeaveApiV1LeavesLeaveIdGet({
      path: { leave_id: id },
    });
    return response.data as Leave;
  }

  async createLeave(data: LeaveCreate): Promise<Leave> {
    const response = await createLeaveApiV1LeavesPost({
      body: data,
    });
    return response.data as Leave;
  }

  async updateLeave(id: string, data: LeaveUpdate): Promise<Leave> {
    const response = await updateLeaveApiV1LeavesLeaveIdPut({
      path: { leave_id: id },
      body: data,
    });
    return response.data as Leave;
  }

  async deleteLeave(id: string): Promise<void> {
    await deleteLeaveApiV1LeavesLeaveIdDelete({
      path: { leave_id: id },
    });
  }
}

export default new LeaveService();
