import {
  loginForAccessTokenApiV1AuthLoginPost,
  logoutApiV1AuthLogoutPost,
  refreshAccessTokenApiV1AuthRefreshPost,
  readUsersMeApiV1AuthMeGet,
} from "@/api";
import type { Token, User } from "@/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<Token> {
    try {
      const response = await loginForAccessTokenApiV1AuthLoginPost({
        body: {
          grant_type: "password",
          username: credentials.email,
          password: credentials.password,
        },
      });

      const data = response.data as Token;

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Try to call backend logout to invalidate tokens
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await logoutApiV1AuthLogoutPost({
          body: { refresh_token: refreshToken },
        });
      }
    } catch (error) {
      // Ignore backend errors during logout, we still want to clear local storage
      console.error("Backend logout error:", error);
    } finally {
      // Always clear local storage even if backend call fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await refreshAccessTokenApiV1AuthRefreshPost({
        body: { refresh_token: refreshToken },
      });

      const data = response.data as { access_token: string };
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } catch (error) {
      // If refresh fails, clear everything and redirect to login
      this.logout();
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await readUsersMeApiV1AuthMeGet();
      const data = response.data as User;
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error getting current user:", error);
      // If fetching user fails, assume token is invalid and log out
      this.logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }
}

export default new AuthService();
