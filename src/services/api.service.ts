import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { API_CONFIG } from "../config/api"

class ApiService {
  private api: AxiosInstance
  private refreshPromise: Promise<string> | null = null
  private onUnauthorized: (() => void) | null = null
  private onTokenRefreshed: (() => void) | null = null

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
          this.handleAuthFailure()
          return Promise.reject(error)
        }

        // Si erreur 401 et pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem("refresh_token")
            if (!refreshToken) {
              throw new Error("No refresh token available")
            }

            // Utiliser une promise partagée pour éviter les appels concurrents
            if (!this.refreshPromise) {
              this.refreshPromise = this.performTokenRefresh(refreshToken).finally(() => {
                this.refreshPromise = null
              })
            }

            const access_token = await this.refreshPromise

            // Créer un nouvel objet headers avec le nouveau token
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${access_token}`
            }

            // Relancer la requête avec le nouveau token
            return this.api(originalRequest)
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  // Méthode pour effectuer le refresh du token
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    // Utiliser axios directement pour éviter l'intercepteur
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const { access_token } = response.data
    localStorage.setItem("access_token", access_token)

    // Notify that token was refreshed
    if (this.onTokenRefreshed) {
      this.onTokenRefreshed()
    }

    return access_token
  }

  // Méthode pour gérer l'échec d'authentification
  private handleAuthFailure(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")

    // Utiliser le callback si disponible, sinon redirection directe
    if (this.onUnauthorized) {
      this.onUnauthorized()
    } else {
      window.location.href = "/login"
    }
  }

  // Méthode pour définir le callback de déconnexion
  setUnauthorizedCallback(callback: () => void): void {
    this.onUnauthorized = callback
  }

  // Méthode pour définir le callback de rafraîchissement du token
  setTokenRefreshedCallback(callback: () => void): void {
    this.onTokenRefreshed = callback
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
