/**
 * Mock System Configuration
 *
 * This file contains configuration for the mock data system.
 * The mock system can be enabled/disabled via VITE_USE_MOCK_API environment variable.
 */

export const MOCK_CONFIG = {
  // Whether mock mode is enabled
  enabled: import.meta.env.VITE_USE_MOCK_API === 'true',

  // Simulated network delay range (ms)
  minDelay: 200,
  maxDelay: 500,

  // Default pagination settings
  defaultPageSize: 10,

  // Mock JWT tokens
  mockAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJkZW1vQGt1aWxpbmdhLmNvbSIsInJvbGUiOiJhZG1pbi1vcmdhbml6YXRpb24iLCJleHAiOjk5OTk5OTk5OTl9.mock',
  mockRefreshToken: 'mock-refresh-token-12345',

  // Demo user credentials (any of these will work)
  demoCredentials: [
    { email: 'superadmin@kuilinga.com', password: 'demo123', role: 'super-admin' },
    { email: 'admin@kuilinga.com', password: 'demo123', role: 'admin-organization' },
    { email: 'rh@kuilinga.com', password: 'demo123', role: 'rh' },
    { email: 'manager@kuilinga.com', password: 'demo123', role: 'manager' },
    { email: 'employee@kuilinga.com', password: 'demo123', role: 'employee' },
  ],

  // Logging
  logRequests: true,
  logResponses: false,
};

/**
 * Creates a mock error response
 * Used by mock handlers to simulate API errors
 */
export function createMockError(status: number, data: any): Error {
  const error = new Error(`Mock API Error: ${status}`) as any;
  error.response = {
    status,
    data,
  };
  return error;
}
