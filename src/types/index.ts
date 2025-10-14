// Types pour l'authentification
export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: "admin" | "manager" | "employee" | "teacher" | "student"
  photo?: string
  organisation_id: string
  site_id?: string
  departement_id?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

// Types pour les présences
export interface Attendance {
  id: string
  employee_id: string
  employee_name: string
  matricule: string
  heure_arrivee: string
  heure_depart?: string
  statut: "present" | "absent" | "retard" | "sortie_anticipee"
  duree?: number
  departement: string
  classe?: string
  device_id?: string
  timestamp: string
}

export interface AttendanceStats {
  presents: number
  absents: number
  retards: number
  heures_travail: number
  taux_presence: number
}

// Types pour les rapports
export interface Report {
  id: string
  type: "presence" | "retards" | "absences" | "heures_sup"
  periode: {
    debut: string
    fin: string
  }
  data: unknown
  created_at: string
}

export interface ReportFilter {
  periode: "jour" | "semaine" | "mois" | "annee" | "personnalise"
  date_debut?: string
  date_fin?: string
  departement?: string
  classe?: string
  site?: string
}

// Types pour les utilisateurs
export interface Employee {
  id: string
  matricule: string
  nom: string
  prenom: string
  email: string
  role: string
  badge_id?: string
  photo?: string
  departement: string
  site: string
  statut: "actif" | "inactif" | "suspendu"
  date_embauche: string
}

// Types pour les organisations, sites et départements
export interface Organization {
  id: string
  name: string
  industry?: string
  contact_email?: string
  phone_number?: string
  timezone: string
  subscription_plan: string
  is_active: boolean
  settings?: Record<string, unknown>
  sites?: Site[]
}

export interface Site {
  id: string
  name: string
  location?: string
  timezone: string
  organization_id: string
}

export interface Department {
  id: string
  name: string
  site_id: string
  manager_id?: string
}

// Types pour les terminaux (Devices)
export type DeviceStatus = "online" | "offline" | "maintenance"

export interface Device {
  id: string
  serial_number: string
  model: string
  status: DeviceStatus
  organization_id: string
}

// Types pour les congés (Leaves)
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"
export type LeaveType = "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "other"

export interface Leave {
  id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
  employee_id: string
  status: LeaveStatus
  approver_id?: string
  notes?: string
  employee?: Employee
  approver?: User
}

// Types pour les notifications
export interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  titre: string
  message: string
  lu: boolean
  timestamp: string
  action_url?: string
}

// Types pour les graphiques
export interface ChartData {
  name: string
  value: number
  [key: string]: unknown
}

// Types pour les filtres
export interface Filter {
  search?: string
  departement?: string
  classe?: string
  site?: string
  statut?: string
  date?: string
}

// Types pour la pagination
export interface PaginationParams {
  page: number
  limit: number
  total?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
