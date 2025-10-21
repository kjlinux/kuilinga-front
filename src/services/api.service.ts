import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { API_CONFIG } from "../config/api"

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Intercepteur pour ajouter le token à chaque requête
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Intercepteur pour gérer les erreurs et le refresh token
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Si la réponse d'erreur est un blob, ne pas tenter de lire `error.response.data.detail`
        if (error.response?.data instanceof Blob) {
          // Gérer l'erreur de blob ici, si nécessaire.
          // Par exemple, on peut essayer de lire le blob comme du texte pour voir s'il contient un message d'erreur JSON.
        } else if (
          error.response?.status === 403 &&
          error.response?.data?.detail === "Could not validate credentials"
        ) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // Si erreur 401 et pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem("refresh_token")
            if (refreshToken) {
              const response = await this.api.post(API_CONFIG.ENDPOINTS.REFRESH, {
                refresh_token: refreshToken,
              })

              const { access_token } = response.data
              localStorage.setItem("access_token", access_token)

              originalRequest.headers.Authorization = `Bearer ${access_token}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            window.location.href = "/login"
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  // Méthodes HTTP génériques
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, config)
      return response
    } catch (error) {
      console.error(`GET ${url} failed:`, error)
      throw error
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data, config)
      return response
    } catch (error) {
      console.error(`POST ${url} failed:`, error)
      throw error
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data, config)
      return response
    } catch (error) {
      console.error(`PUT ${url} failed:`, error)
      throw error
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url, config)
      return response
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error)
      throw error
    }
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(url, data, config)
      return response
    } catch (error) {
      console.error(`PATCH ${url} failed:`, error)
      throw error
    }
  }
}

export const apiService = new ApiService()
