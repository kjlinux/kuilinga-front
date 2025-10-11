// lib/mocks/reports.ts

export const monthlyAttendanceData = {
  month: "Juin 2024",
  data: [
    { day: 1, attendance: 95 },
    { day: 2, attendance: 96 },
    { day: 3, attendance: 94 },
    { day: 4, attendance: 97 },
    { day: 5, attendance: 98 },
    { day: 6, attendance: 92 },
    { day: 7, attendance: 95 },
    { day: 8, attendance: 96 },
    { day: 9, attendance: 93 },
    { day: 10, attendance: 95 },
  ],
};

export const departmentComparisonData = [
  { department: "IT", attendance: 95, delays: 5, absences: 2 },
  { department: "RH", attendance: 92, delays: 8, absences: 3 },
  { department: "Finance", attendance: 98, delays: 2, absences: 1 },
  { department: "Marketing", attendance: 90, delays: 10, absences: 5 },
];

export const topPerformersData = [
  { rank: 1, name: "Pierre Dubois", attendanceRate: "99.5%", department: "Finance" },
  { rank: 2, name: "Jean Dupont", attendanceRate: "99.2%", department: "IT" },
  { rank: 3, name: "Luc Bernard", attendanceRate: "98.9%", department: "IT" },
  { rank: 4, name: "Marie Martin", attendanceRate: "98.5%", department: "RH" },
  { rank: 5, name: "Sophie Laurent", attendanceRate: "98.1%", department: "Marketing" },
];
