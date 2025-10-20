import { UserRole } from "@/types";

export enum ReportId {
  // Super Admin / Admin Organisation
  R1_MultiOrgConsolidated = "R1",
  R2_ComparativeAnalysis = "R2",
  R3_DeviceUsage = "R3",
  R4_UserAudit = "R4",

  // Admin Organisation / RH Principal
  R5_OrgPresence = "R5",
  R6_MonthlySynthetic = "R6",
  R7_AbsenceAnalysis = "R7",
  R8_Anomalies = "R8",
  R9_EmployeeWorkedHours = "R9",
  R10_SiteActivity = "R10",
  R11_PayrollExport = "R11",

  // Manager
  R12_DeptPresence = "R12",
  R13_TeamWeekly = "R13",
  R14_HoursValidation = "R14",
  R15_LeaveRequests = "R15",
  R16_TeamPerformance = "R16",

  // Employee
  R17_MyPresence = "R17",
  R18_MyMonthlySummary = "R18",
  R19_MyLeaves = "R19",
  R20_MyPresenceCertificate = "R20",
}

export enum FilterType {
  DateRange = "date_range",
  Period = "period",
  Organization = "organization",
  Site = "site",
  Department = "department",
  Employee = "employee",
  Metric = "metric",
  Grouping = "grouping",
  LeaveType = "leave_type",
  LeaveStatus = "leave_status",
  TardinessThreshold = "tardiness_threshold",
  AnomalyType = "anomaly_type",
  IncludeWeekends = "include_weekends",
  HourFormat = "hour_format",
  ExportFormat = "export_format",
  Columns = "columns",
  Week = "week",
  Month = "month",
  Year = "year",
  ValidationStatus = "validation_status",
  Language = "language",
  IncludeCharts = "include_charts",
  Quarter = "quarter",
  Status = "status",
  Role = "role",
  IsActive = "is_active",
}

export interface ReportConfig {
  id: ReportId;
  title: string;
  description: string;
  roles: UserRole[];
  filters: FilterType[];
  previewEndpoint: string;
  downloadEndpoint: string;
}

export const REPORTS_CONFIG: ReportConfig[] = [
  // == SUPER ADMIN / ADMIN ORGANISATION ==
  {
    id: ReportId.R1_MultiOrgConsolidated,
    title: "Rapport Consolidé Multi-Organisations",
    description: "Vue agrégée de toutes les organisations.",
    roles: [UserRole.SuperAdmin, UserRole.AdminOrganization],
    filters: [FilterType.DateRange, FilterType.Organization, FilterType.Metric, FilterType.Grouping],
    previewEndpoint: "/api/v1/reports/superuser/multi-org-consolidated/preview",
    downloadEndpoint: "/api/v1/reports/superuser/multi-org-consolidated/download",
  },
  {
    id: ReportId.R2_ComparativeAnalysis,
    title: "Analyse Comparative",
    description: "Compare les indicateurs clés entre organisations.",
    roles: [UserRole.SuperAdmin],
    filters: [FilterType.Year, FilterType.Month, FilterType.Quarter, FilterType.Organization],
    previewEndpoint: "/api/v1/reports/superuser/comparative-analysis/preview",
    downloadEndpoint: "/api/v1/reports/superuser/comparative-analysis/download",
  },
  {
    id: ReportId.R3_DeviceUsage,
    title: "Utilisation des Terminaux",
    description: "Statut et activité des terminaux de pointage.",
    roles: [UserRole.SuperAdmin, UserRole.AdminOrganization],
    filters: [FilterType.DateRange, FilterType.Organization, FilterType.Site, FilterType.Status],
    previewEndpoint: "/api/v1/reports/superuser/device-usage/preview",
    downloadEndpoint: "/api/v1/reports/superuser/device-usage/download",
  },
  {
    id: ReportId.R4_UserAudit,
    title: "Audit Utilisateurs et Rôles",
    description: "Liste des utilisateurs et de leurs accès.",
    roles: [UserRole.SuperAdmin],
    filters: [FilterType.Organization, FilterType.Role, FilterType.IsActive],
    previewEndpoint: "/api/v1/reports/superuser/user-audit/preview",
    downloadEndpoint: "/api/v1/reports/superuser/user-audit/download",
  },

  // == ADMIN ORGANISATION / RH PRINCIPAL ==
  {
    id: ReportId.R5_OrgPresence,
    title: "Rapport de Présence Globale",
    description: "Présence de tous les employés de l'organisation.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.DateRange, FilterType.Site, FilterType.Department],
    previewEndpoint: "/api/v1/reports/organization/presence/preview",
    downloadEndpoint: "/api/v1/reports/organization/presence/download",
  },
  {
    id: ReportId.R6_MonthlySynthetic,
    title: "Rapport Mensuel Synthétique",
    description: "Synthèse mensuelle pour la paie.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.Month, FilterType.Year, FilterType.Site, FilterType.Department],
    previewEndpoint: "/api/v1/reports/organization/monthly-synthetic/preview",
    downloadEndpoint: "/api/v1/reports/organization/monthly-synthetic/download",
  },
  {
    id: ReportId.R7_AbsenceAnalysis,
    title: "Analyse des Absences et Congés",
    description: "Détail de tous les types de congés.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.DateRange, FilterType.LeaveType, FilterType.LeaveStatus, FilterType.Department, FilterType.Employee],
    previewEndpoint: "/api/v1/reports/organization/leaves/preview",
    downloadEndpoint: "/api/v1/reports/organization/leaves/download",
  },
  {
    id: ReportId.R8_Anomalies,
    title: "Rapport d'Anomalies",
    description: "Retards, absences imprévues, etc.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.DateRange, FilterType.Site, FilterType.Department, FilterType.TardinessThreshold],
    previewEndpoint: "/api/v1/reports/organization/anomalies/preview",
    downloadEndpoint: "/api/v1/reports/organization/anomalies/download",
  },
  {
    id: ReportId.R9_EmployeeWorkedHours,
    title: "Rapport Heures Travaillées par Employé",
    description: "Décompte horaire détaillé.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.DateRange, FilterType.Employee, FilterType.Department, FilterType.IncludeWeekends, FilterType.HourFormat],
    previewEndpoint: "/api/v1/reports/organization/worked-hours/preview",
    downloadEndpoint: "/api/v1/reports/organization/worked-hours/download",
  },
  {
    id: ReportId.R10_SiteActivity,
    title: "Rapport d'Activité par Site",
    description: "Activité globale par site.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.DateRange, FilterType.Site],
    previewEndpoint: "/api/v1/reports/organization/site-activity/preview",
    downloadEndpoint: "/api/v1/reports/organization/site-activity/download",
  },
  {
    id: ReportId.R11_PayrollExport,
    title: "Export Paie",
    description: "Génère un fichier pour le système de paie.",
    roles: [UserRole.AdminOrganization, UserRole.RH],
    filters: [FilterType.Year, FilterType.Month, FilterType.Site],
    previewEndpoint: "/api/v1/reports/organization/payroll-export/download",
    downloadEndpoint: "/api/v1/reports/organization/payroll-export/download",
  },

  // == MANAGER ==
  {
    id: ReportId.R12_DeptPresence,
    title: "Rapport de Présence Département",
    description: "Présence de l'équipe du département.",
    roles: [UserRole.Manager],
    filters: [FilterType.DateRange, FilterType.Employee, FilterType.Grouping],
    previewEndpoint: "/api/v1/reports/manager/department-presence/preview",
    downloadEndpoint: "/api/v1/reports/manager/department-presence/download",
  },
  {
    id: ReportId.R13_TeamWeekly,
    title: "Rapport Hebdomadaire Équipe",
    description: "Synthèse hebdomadaire automatique.",
    roles: [UserRole.Manager],
    filters: [FilterType.Week, FilterType.Year],
    previewEndpoint: "/api/v1/reports/manager/team-weekly/preview",
    downloadEndpoint: "/api/v1/reports/manager/team-weekly/download",
  },
  {
    id: ReportId.R14_HoursValidation,
    title: "Validation des Heures",
    description: "Valider les heures de travail de l'équipe.",
    roles: [UserRole.Manager],
    filters: [FilterType.Year, FilterType.Month, FilterType.Employee, FilterType.ValidationStatus],
    previewEndpoint: "/api/v1/reports/manager/hours-validation/preview",
    downloadEndpoint: "/api/v1/reports/manager/hours-validation/download",
  },
  {
    id: ReportId.R15_LeaveRequests,
    title: "Demandes de Congés",
    description: "Congés en attente et historique.",
    roles: [UserRole.Manager],
    filters: [FilterType.DateRange, FilterType.LeaveStatus, FilterType.LeaveType, FilterType.Employee],
    previewEndpoint: "/api/v1/reports/manager/department-leaves/preview",
    downloadEndpoint: "/api/v1/reports/manager/department-leaves/download",
  },
  {
    id: ReportId.R16_TeamPerformance,
    title: "Performance Présence Équipe",
    description: "Indicateurs de performance.",
    roles: [UserRole.Manager],
    filters: [FilterType.Period],
    previewEndpoint: "/api/v1/reports/manager/team-performance/preview",
    downloadEndpoint: "/api/v1/reports/manager/team-performance/download",
  },

  // == EMPLOYEE ==
  {
    id: ReportId.R17_MyPresence,
    title: "Mon Relevé de Présence",
    description: "Historique personnel de pointages.",
    roles: [UserRole.Employee],
    filters: [FilterType.DateRange],
    previewEndpoint: "/api/v1/reports/employee/presence/preview",
    downloadEndpoint: "/api/v1/reports/employee/presence/download",
  },
  {
    id: ReportId.R18_MyMonthlySummary,
    title: "Mon Récapitulatif Mensuel",
    description: "Synthèse du mois.",
    roles: [UserRole.Employee],
    filters: [FilterType.Month, FilterType.Year, FilterType.IncludeCharts],
    previewEndpoint: "/api/v1/reports/employee/monthly-summary/preview",
    downloadEndpoint: "/api/v1/reports/employee/monthly-summary/download",
  },
  {
    id: ReportId.R19_MyLeaves,
    title: "Mes Congés",
    description: "Historique et solde de congés.",
    roles: [UserRole.Employee],
    filters: [FilterType.Year, FilterType.LeaveType, FilterType.LeaveStatus],
    previewEndpoint: "/api/v1/reports/employee/leaves/preview",
    downloadEndpoint: "/api/v1/reports/employee/leaves/download",
  },
  {
    id: ReportId.R20_MyPresenceCertificate,
    title: "Mon Attestation de Présence",
    description: "Document officiel pour démarches.",
    roles: [UserRole.Employee],
    filters: [FilterType.Period, FilterType.Language],
    previewEndpoint: "/api/v1/reports/employee/presence-certificate/download", // Note: This is a download-only report
    downloadEndpoint: "/api/v1/reports/employee/presence-certificate/download",
  },
];