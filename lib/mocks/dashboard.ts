// lib/mocks/dashboard.ts

export const dashboardStats = [
  {
    title: "Présents aujourd'hui",
    value: "847",
    change: "+12%",
    trend: "up",
  },
  {
    title: "Absents aujourd'hui",
    value: "23",
    change: "-5%",
    trend: "down",
  },
  {
    title: "Retards",
    value: "15",
    change: "+3%",
    trend: "up",
  },
  {
    title: "Taux de présence",
    value: "97.4%",
    change: "+2.1%",
    trend: "up",
  },
];

export const attendanceTrendData = [
  { date: "Lun", presents: 820, absents: 30, retards: 20 },
  { date: "Mar", presents: 835, absents: 25, retards: 15 },
  { date: "Mer", presents: 845, absents: 20, retards: 18 },
  { date: "Jeu", presents: 830, absents: 28, retards: 22 },
  { date: "Ven", presents: 847, absents: 23, retards: 15 },
  { date: "Sam", presents: 420, absents: 5, retards: 8 },
  { date: "Dim", presents: 0, absents: 0, retards: 0 },
];

export const attendanceDistributionData = [
  { name: "Présents", value: 847, color: "hsl(var(--chart-1))" },
  { name: "Absents", value: 23, color: "hsl(var(--chart-5))" },
  { name: "Retards", value: 15, color: "hsl(var(--chart-2))" },
];

export const recentActivities = [
    {
    id: 1,
    employee: "Jean Dupont",
    action: "Pointage d'entrée",
    time: "08:15",
    status: "present",
    department: "IT",
  },
  {
    id: 2,
    employee: "Marie Martin",
    action: "Pointage d'entrée",
    time: "08:45",
    status: "late",
    department: "RH",
  },
  {
    id: 3,
    employee: "Pierre Dubois",
    action: "Pointage de sortie",
    time: "17:30",
    status: "present",
    department: "Finance",
  },
  {
    id: 4,
    employee: "Sophie Laurent",
    action: "Absence justifiée",
    time: "09:00",
    status: "absent",
    department: "Marketing",
  },
  {
    id: 5,
    employee: "Luc Bernard",
    action: "Pointage d'entrée",
    time: "08:30",
    status: "present",
    department: "IT",
  },
];
