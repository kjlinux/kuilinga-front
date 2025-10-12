import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { AuthResponse, LoginCredentials, User } from "../types"

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials)

    // Stocker les tokens
    localStorage.setItem("access_token", response.access_token)
    localStorage.setItem("refresh_token", response.refresh_token)
    localStorage.setItem("user", JSON.stringify(response.user))

    return response
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.LOGOUT)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await apiService.post<{ access_token: string }>(API_CONFIG.ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    })

    localStorage.setItem("access_token", response.access_token)
    return response.access_token
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email })
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  }
}

export default new AuthService()
