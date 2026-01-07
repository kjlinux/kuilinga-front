import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { client } from './client.gen';

// Configure baseURL from environment
client.setConfig({
  baseURL: import.meta.env.VITE_API_URL || '',
  // Provide auth token for bearer authentication
  auth: async () => {
    const token = localStorage.getItem('access_token');
    return token || undefined;
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for handling 401 errors with token refresh
client.instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client.instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No refresh token, clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Import dynamically to avoid circular dependency
        const { refreshAccessTokenApiV1AuthRefreshPost } = await import('./sdk.gen');

        const response = await refreshAccessTokenApiV1AuthRefreshPost({
          body: { refresh_token: refreshToken },
        });

        if (response.data?.access_token) {
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);

          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return client.instance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Refresh failed, clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 with "Could not validate credentials" - force logout
    if (error.response?.status === 403) {
      const errorData = error.response.data as { detail?: string };
      if (errorData?.detail === 'Could not validate credentials') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { client };
