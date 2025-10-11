// lib/api/index.ts

import { dashboardStats, attendanceTrendData, attendanceDistributionData, recentActivities } from "@/lib/mocks/dashboard";
import { attendanceData } from "@/lib/mocks/presence";
import { monthlyAttendanceData, departmentComparisonData, topPerformersData } from "@/lib/mocks/reports";
import { currentUser } from "@/lib/mocks/users";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getDashboardStats: async () => {
    await delay(500);
    return dashboardStats;
  },
  getAttendanceTrend: async () => {
    await delay(800);
    return attendanceTrendData;
  },
  getAttendanceDistribution: async () => {
    await delay(600);
    return attendanceDistributionData;
  },
  getRecentActivities: async () => {
    await delay(700);
    return recentActivities;
  },
  getAttendanceData: async (searchTerm?: string, department?: string) => {
    await delay(500);
    let data = attendanceData;
    if (searchTerm) {
      data = data.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (department && department !== "all") {
      data = data.filter(d => d.department === department);
    }
    return data;
  },
  getMonthlyAttendance: async (period: string) => {
    await delay(900);
    // In a real app, you'd fetch data based on the period
    console.log(`Fetching monthly attendance for period: ${period}`);
    return monthlyAttendanceData;
  },
  getDepartmentComparison: async (period: string) => {
    await delay(750);
    console.log(`Fetching department comparison for period: ${period}`);
    return departmentComparisonData;
  },
  getTopPerformers: async (period: string) => {
    await delay(650);
    console.log(`Fetching top performers for period: ${period}`);
    return topPerformersData;
  },
  getCurrentUser: async () => {
    await delay(400);
    return currentUser;
  },
  updateUserSettings: async (settings: { language?: string; theme?: string }) => {
    await delay(300);
    currentUser.settings = { ...currentUser.settings, ...settings };
    return currentUser;
  },
};
