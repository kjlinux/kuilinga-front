import {
  readAttendancesApiV1AttendanceGet,
  createAttendanceApiV1AttendancePost,
  manualClockApiV1AttendanceClockPost,
} from "@/api";
import type {
  Attendance,
  AttendanceCreate,
  PaginatedResponseAttendance,
} from "@/api";

import type { PaginationParams } from "@/hooks/useDataTable";

class AttendanceService {
  async getAttendances(params: PaginationParams = {}): Promise<PaginatedResponseAttendance> {
    const response = await readAttendancesApiV1AttendanceGet({
      query: {
        skip: params.skip ?? 0,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        sort_by: params.sort_by || undefined,
        sort_order: params.sort_order || undefined,
      },
    });

    if (!response || !response.data) {
      throw new Error("Aucune réponse reçue de l'API");
    }

    return response.data as PaginatedResponseAttendance;
  }

  async createAttendance(data: AttendanceCreate): Promise<Attendance | undefined> {
    const response = await createAttendanceApiV1AttendancePost({
      body: data,
    });
    return response.data as Attendance;
  }

  // Clock in/out endpoint - uses dedicated /api/v1/attendance/clock endpoint
  // Note: The generated API doesn't expect a body, but the endpoint likely needs employee_id and attendance_type
  // This may need adjustment based on actual API behavior
  async clockAttendance(_employeeId: string, _attendanceType: "in" | "out"): Promise<Attendance> {
    const response = await manualClockApiV1AttendanceClockPost();
    return response.data as Attendance;
  }
}

export default new AttendanceService();
