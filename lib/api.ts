// Service API pour communiquer avec le backend FastAPI

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Récupérer le token depuis le localStorage si disponible
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || "Une erreur est survenue",
          status: response.status,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Erreur réseau",
        status: 500,
      }
    }
  }

  // Authentification
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    this.clearToken()
    return { status: 200 }
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    })
  }

  // Utilisateurs
  async getCurrentUser() {
    return this.request("/users/me", {
      method: "GET",
    })
  }

  async getEmployees(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters)
    return this.request(`/employees?${params}`, {
      method: "GET",
    })
  }

  // Présences
  async getAttendances(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters)
    return this.request(`/attendances?${params}`, {
      method: "GET",
    })
  }

  async createAttendance(data: {
    employeeId: string
    type: "in" | "out"
    timestamp?: string
  }) {
    return this.request("/attendances", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Statistiques
  async getDashboardStats() {
    return this.request("/stats/dashboard", {
      method: "GET",
    })
  }

  async getTrendData(period: string) {
    return this.request(`/stats/trends?period=${period}`, {
      method: "GET",
    })
  }

  // Rapports
  async getReports(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters)
    return this.request(`/reports?${params}`, {
      method: "GET",
    })
  }

  async generateReport(type: string, period: string) {
    return this.request("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ type, period }),
    })
  }

  async exportReport(reportId: string, format: "csv" | "xlsx" | "pdf") {
    return this.request(`/reports/${reportId}/export?format=${format}`, {
      method: "GET",
    })
  }

  // Organisations
  async getOrganization(id: string) {
    return this.request(`/orgs/${id}`, {
      method: "GET",
    })
  }

  // Devices
  async getDevices() {
    return this.request("/devices", {
      method: "GET",
    })
  }

  async updateDevice(id: string, data: Partial<{ status: string }>) {
    return this.request(`/devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService(API_BASE_URL)
export const api = apiService
export default apiService
