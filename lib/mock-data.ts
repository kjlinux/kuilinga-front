// Données mockées pour le développement et les tests

import type { DashboardStats, TrendData, AttendanceRecord, DepartmentData, TopPerformer, RecentActivity } from "./types"

export const mockDashboardStats: DashboardStats = {
  presentToday: 847,
  absentToday: 23,
  lateToday: 12,
  totalHours: 6784,
  presentChange: 5.2,
  absentChange: -2.1,
  lateChange: -1.5,
  hoursChange: 3.8,
}

export const mockTrendData: TrendData[] = [
  { date: "Lun", present: 820, absent: 30, late: 15 },
  { date: "Mar", present: 835, absent: 25, late: 10 },
  { date: "Mer", present: 840, absent: 20, late: 12 },
  { date: "Jeu", present: 830, absent: 28, late: 14 },
  { date: "Ven", present: 847, absent: 23, late: 12 },
  { date: "Sam", present: 450, absent: 420, late: 8 },
  { date: "Dim", present: 380, absent: 490, late: 5 },
]

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    name: "Jean Dupont",
    matricule: "EMP001",
    department: "Développement",
    checkIn: "08:45",
    checkOut: "17:30",
    status: "present",
    hoursWorked: 8.75,
  },
  {
    id: "2",
    name: "Marie Martin",
    matricule: "EMP002",
    department: "Design",
    checkIn: "09:15",
    checkOut: "18:00",
    status: "late",
    hoursWorked: 8.75,
  },
  {
    id: "3",
    name: "Pierre Dubois",
    matricule: "EMP003",
    department: "Marketing",
    checkIn: "08:30",
    checkOut: "17:15",
    status: "present",
    hoursWorked: 8.75,
  },
  {
    id: "4",
    name: "Sophie Bernard",
    matricule: "EMP004",
    department: "RH",
    checkIn: "09:00",
    status: "present",
  },
  {
    id: "5",
    name: "Luc Petit",
    matricule: "EMP005",
    department: "Finance",
    checkIn: "",
    status: "absent",
  },
  {
    id: "6",
    name: "Claire Moreau",
    matricule: "EMP006",
    department: "Développement",
    checkIn: "08:50",
    checkOut: "17:45",
    status: "present",
    hoursWorked: 8.92,
  },
  {
    id: "7",
    name: "Thomas Laurent",
    matricule: "EMP007",
    department: "Support",
    checkIn: "09:20",
    status: "late",
  },
  {
    id: "8",
    name: "Emma Simon",
    matricule: "EMP008",
    department: "Design",
    checkIn: "08:40",
    checkOut: "17:20",
    status: "present",
    hoursWorked: 8.67,
  },
]

export const mockDepartmentData: DepartmentData[] = [
  { name: "Développement", present: 245, absent: 5, late: 3 },
  { name: "Design", present: 128, absent: 2, late: 1 },
  { name: "Marketing", present: 156, absent: 4, late: 2 },
  { name: "RH", present: 89, absent: 3, late: 1 },
  { name: "Finance", present: 112, absent: 5, late: 2 },
  { name: "Support", present: 117, absent: 4, late: 3 },
]

export const mockTopPerformers: TopPerformer[] = [
  {
    id: "1",
    name: "Jean Dupont",
    department: "Développement",
    attendanceRate: 98.5,
  },
  {
    id: "2",
    name: "Marie Martin",
    department: "Design",
    attendanceRate: 97.8,
  },
  {
    id: "3",
    name: "Pierre Dubois",
    department: "Marketing",
    attendanceRate: 97.2,
  },
  {
    id: "4",
    name: "Sophie Bernard",
    department: "RH",
    attendanceRate: 96.9,
  },
  {
    id: "5",
    name: "Claire Moreau",
    department: "Développement",
    attendanceRate: 96.5,
  },
]

export const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    employeeName: "Jean Dupont",
    action: "Pointage d'entrée",
    timestamp: "Il y a 5 minutes",
    status: "in",
  },
  {
    id: "2",
    employeeName: "Marie Martin",
    action: "Pointage de sortie",
    timestamp: "Il y a 12 minutes",
    status: "out",
  },
  {
    id: "3",
    employeeName: "Pierre Dubois",
    action: "Pointage d'entrée (retard)",
    timestamp: "Il y a 25 minutes",
    status: "late",
  },
  {
    id: "4",
    employeeName: "Sophie Bernard",
    action: "Pointage d'entrée",
    timestamp: "Il y a 1 heure",
    status: "in",
  },
  {
    id: "5",
    employeeName: "Claire Moreau",
    action: "Pointage de sortie",
    timestamp: "Il y a 2 heures",
    status: "out",
  },
]
