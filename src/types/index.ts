// User and Authentication Types
export interface User {
  id: string
  email: string
  prenom: string
  nom: string
  role: string
  photo?: string
  organization_id?: string
  roles?: Role[]
  permissions?: string[]
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

// Role and Permission Types
export interface Role {
  id: string
  name: string
  description?: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

// Organization Types
export interface Organization {
  id: string
  nom: string
  description?: string
  adresse?: string
  telephone?: string
  email?: string
  logo?: string
  created_at: string
  updated_at?: string
}

// Site Types
export interface Site {
  id: string
  nom: string
  adresse?: string
  organization_id: string
  created_at: string
  updated_at?: string
}

// Department Types
export interface Department {
  id: string
  nom: string
  description?: string
  organization_id: string
  site_id?: string
  created_at: string
  updated_at?: string
}

// Employee Types
export interface Employee {
  id: string
  matricule: string
  prenom: string
  nom: string
  email?: string
  telephone?: string
  photo?: string
  poste?: string
  departement?: string
  date_embauche?: string
  organization_id: string
  department_id?: string
  site_id?: string
  created_at: string
  updated_at?: string
}

// Device Types
export interface Device {
  id: string
  nom: string
  type: string
  serial_number?: string
  ip_address?: string
  status: 'active' | 'inactive' | 'maintenance'
  organization_id: string
  site_id?: string
  created_at: string
  updated_at?: string
}

// Attendance Types
export interface Attendance {
  id: string
  employee_id: string
  device_id?: string
  type: 'entry' | 'exit'
  timestamp: string
  location?: string
  method?: 'biometric' | 'card' | 'manual'
  notes?: string
  created_at: string
}

export interface AttendanceStats {
  total_employees: number
  present_today: number
  absent_today: number
  late_today: number
  on_leave: number
}

// Leave Types
export interface Leave {
  id: string
  employee_id: string
  type: 'vacation' | 'sick' | 'personal' | 'other'
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  notes?: string
  created_at: string
  updated_at?: string
}

// Notification Types
export interface Notification {
  id: string
  titre: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  lu: boolean
  timestamp: string
  user_id?: string
  created_at?: string
}

// Report Types
export interface ReportFilters {
  start_date?: string
  end_date?: string
  employee_id?: string
  department_id?: string
  site_id?: string
  organization_id?: string
}

export interface AttendanceReport {
  employee_id: string
  employee_name: string
  total_days: number
  present_days: number
  absent_days: number
  late_days: number
  overtime_hours: number
}

// Pagination Types
export interface PaginationParams {
  skip?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// Dashboard Types
export interface DashboardStats {
  total_employees: number
  present_today: number
  absent_today: number
  late_today: number
  on_leave: number
  total_attendance_today: number
  attendance_rate: number
}