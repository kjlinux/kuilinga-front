/**
 * Mock Axios Interceptor
 *
 * Intercepts all Axios requests and returns mock data instead of calling the real API.
 * This allows the frontend to work without a backend connection.
 */

import { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MOCK_CONFIG } from './config';
import { simulateDelay } from './utils/delay';
import { mockHandlers } from './handlers';

/**
 * Mock response error type
 */
interface MockError {
  status: number;
  data: any;
}

/**
 * Checks if a request matches a mock handler pattern
 */
const matchesPattern = (url: string, pattern: string | RegExp): boolean => {
  // If pattern is already a RegExp, use it directly
  if (pattern instanceof RegExp) {
    return pattern.test(url);
  }

  // Convert URL pattern to regex (e.g., /api/v1/users/:id => /api/v1/users/[^/]+)
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+') // Replace :param with regex
    .replace(/\//g, '\\/'); // Escape slashes

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
};

/**
 * Extracts path parameters from URL based on pattern
 */
const extractParams = (url: string, pattern: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = urlParts[index];
    }
  });

  return params;
};

/**
 * Finds and executes the appropriate mock handler for a request
 */
const executeMockHandler = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  const method = (config.method || 'get').toUpperCase();
  const url = config.url || '';

  // Remove base URL and query params for matching
  // Also remove trailing slashes to normalize URL matching
  const cleanUrl = url.split('?')[0].replace(/\/$/, '');

  if (MOCK_CONFIG.logRequests) {
    console.log(`[MOCK] ${method} ${cleanUrl}`, {
      params: config.params,
      data: config.data,
    });
  }

  // Find matching handler
  for (const handler of mockHandlers) {
    if (handler.method === method && matchesPattern(cleanUrl, handler.pattern)) {
      try {
        // Simulate network delay
        await simulateDelay();

        // Extract path parameters
        const pathParams = extractParams(cleanUrl, handler.pattern);

        // Execute handler
        const responseData = await handler.handler({
          params: pathParams,
          query: config.params || {},
          body: config.data,
          headers: config.headers as Record<string, string>,
        });

        const response: AxiosResponse = {
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as any,
        };

        if (MOCK_CONFIG.logResponses) {
          console.log(`[MOCK] Response:`, response.data);
        }

        return response;
      } catch (error: any) {
        // Handle mock errors
        if (error.status) {
          const mockError = error as MockError;
          const errorResponse: AxiosResponse = {
            data: mockError.data,
            status: mockError.status,
            statusText: getStatusText(mockError.status),
            headers: {},
            config: config as any,
          };

          if (MOCK_CONFIG.logResponses) {
            console.error(`[MOCK] Error Response:`, errorResponse);
          }

          throw errorResponse;
        }
        throw error;
      }
    }
  }

  // No handler found
  console.warn(`[MOCK] No handler found for ${method} ${cleanUrl}`);
  throw {
    data: { detail: `No mock handler found for ${method} ${cleanUrl}` },
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config: config as any,
  } as AxiosResponse;
};

/**
 * Gets HTTP status text from status code
 */
const getStatusText = (status: number): string => {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };
  return statusTexts[status] || 'Unknown';
};

/**
 * Sets up mock interceptor on an Axios instance
 */
export const setupMockInterceptor = (axiosInstance: AxiosInstance): void => {
  console.log('[MOCK] Mock interceptor enabled - All API requests will use mock data');

  // Request interceptor - intercept and mock the response
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Execute mock handler and throw the response to skip real request
        const mockResponse = await executeMockHandler(config);

        // This is a trick: we throw the mock response which will be caught
        // by the response error interceptor and returned as success
        throw { isMockResponse: true, response: mockResponse };
      } catch (error: any) {
        if (error.isMockResponse) {
          throw error;
        }
        // If it's a mock error (404, 401, etc.), throw it
        throw { isMockError: true, error };
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response error interceptor - handle mock responses
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If it's a mock response disguised as an error, return it as success
      if (error.isMockResponse) {
        return Promise.resolve(error.response);
      }

      // If it's a mock error, reject with the error
      if (error.isMockError) {
        return Promise.reject(error.error);
      }

      // Otherwise, pass through
      return Promise.reject(error);
    }
  );
};

/**
 * Utility function to create mock error responses
 */
export const createMockError = (status: number, data: any): MockError => {
  return { status, data };
};
