import apiService from "./api.service"
import { API_CONFIG } from "../config/api"
import type { LoginCredentials, AuthResponse, User } from "../types"

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      )

      // Store tokens
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("refresh_token", response.refresh_token)
      
      // Store user info
      localStorage.setItem("user", JSON.stringify(response.user))

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if it exists
      await apiService.post(API_CONFIG.ENDPOINTS.LOGOUT)
    } catch (error) {
      console.warn("Logout endpoint error:", error)
    } finally {
      // Always clear local storage
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

    try {
      const response = await apiService.post<{ access_token: string }>(
        API_CONFIG.ENDPOINTS.REFRESH,
        { refresh_token: refreshToken }
      )

      localStorage.setItem("access_token", response.access_token)
      return response.access_token
    } catch (error) {
      // If refresh fails, clear everything and redirect to login
      this.logout()
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get from localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }

      // If not in localStorage, fetch from API
      const user = await apiService.get<User>(API_CONFIG.ENDPOINTS.ME)
      localStorage.setItem("user", JSON.stringify(user))
      return user
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error("Error parsing stored user:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token")
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token")
  }
}

export default new AuthService()