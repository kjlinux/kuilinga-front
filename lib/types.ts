export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "employee" | "integrator"
  avatar?: string
  department?: string
  badgeId?: string
}

export interface Organization {
  id: string
  name: string
  plan: string
  settings: Record<string, unknown>
}

export interface Site {
  id: string
  organizationId: string
  name: string
  address: string
  timezone: string
}

export interface Employee {
  id: string
  organizationId: string
  siteId: string
  name: string
  email: string
  role: string
  badgeId: string
  department: string
  status: "present" | "absent" | "late"
  avatar?: string
  metadata?: Record<string, unknown>
}

export interface Attendance {
  id: string
  employeeId: string
  deviceId?: string
  type: "in" | "out"
  timestamp: string
  geolocation?: {
    lat: number
    lng: number
  }
  metadata?: Record<string, unknown>
}

export interface AttendanceRecord {
  id: string
  name: string
  matricule: string
  department: string
  checkIn: string
  checkOut?: string
  status: "present" | "absent" | "late"
  hoursWorked?: number
}

export interface DashboardStats {
  presentToday: number
  absentToday: number
  lateToday: number
  totalHours: number
  presentChange: number
  absentChange: number
  lateChange: number
  hoursChange: number
}

export interface TrendData {
  date: string
  present: number
  absent: number
  late: number
}

export interface DepartmentData {
  name: string
  present: number
  absent: number
  late: number
}

export interface TopPerformer {
  id: string
  name: string
  department: string
  attendanceRate: number
  avatar?: string
}

export interface RecentActivity {
  id: string
  employeeName: string
  action: string
  timestamp: string
  status: "in" | "out" | "late"
}

export interface Shift {
  id: string
  organizationId: string
  name: string
  startTime: string
  endTime: string
  rules: Record<string, unknown>
}

export interface Report {
  id: string
  type: string
  period: string
  generatedAt: string
  data: unknown
}

export interface Device {
  id: string
  serial: string
  type: string
  siteId: string
  status: "active" | "inactive" | "maintenance"
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: string
  read: boolean
}
