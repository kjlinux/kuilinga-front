/**
 * Auth Mock Data and Handlers
 *
 * Handles authentication-related mock endpoints:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/refresh
 * - GET /api/v1/auth/me
 * - POST /api/v1/auth/logout
 */

import { Token, UserInLogin, UserRole } from '../../types';
import { MOCK_CONFIG, createMockError } from '../config';
import { mockUsers } from './users.mock';

/**
 * Mock current session storage
 */
let currentMockUser: UserInLogin | null = null;
let currentMockAccessToken: string | null = null;
let currentMockRefreshToken: string | null = null;

/**
 * Maps email to demo user
 */
const getDemoUser = (email: string): UserInLogin | null => {
  const demoCredential = MOCK_CONFIG.demoCredentials.find(cred => cred.email === email);
  if (!demoCredential) return null;

  // Find corresponding user in mock users
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    // Create a basic user if not found
    return {
      id: email === 'superadmin@kuilinga.com' ? '1' : '2',
      email,
      full_name: email.split('@')[0].replace(/[.-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      is_superuser: demoCredential.role === 'super-admin',
      roles: [{
        id: demoCredential.role,
        name: demoCredential.role,
        description: `${demoCredential.role} role`,
        permissions: [],
      }],
    };
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name || null,
    is_superuser: user.is_superuser,
    roles: user.roles,
  };
};

/**
 * POST /api/v1/auth/login
 */
export const loginHandler = (request: any): Token => {
  const { email, password } = request.body;

  // Check if credentials match any demo account
  const validCredential = MOCK_CONFIG.demoCredentials.find(
    cred => cred.email === email && cred.password === password
  );

  // Also accept any credentials in mock mode (for flexibility)
  if (!validCredential && !email) {
    throw createMockError(422, {
      detail: [
        {
          loc: ['body', 'email'],
          msg: 'field required',
          type: 'value_error.missing',
        },
      ],
    });
  }

  const user = getDemoUser(email) || getDemoUser('admin@kuilinga.com');

  if (!user) {
    throw createMockError(401, {
      detail: 'Incorrect email or password',
    });
  }

  // Generate mock tokens
  const accessToken = `${MOCK_CONFIG.mockAccessToken}-${Date.now()}`;
  const refreshToken = `${MOCK_CONFIG.mockRefreshToken}-${Date.now()}`;

  // Store current session
  currentMockUser = user;
  currentMockAccessToken = accessToken;
  currentMockRefreshToken = refreshToken;

  const response: Token = {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
    user,
  };

  return response;
};

/**
 * POST /api/v1/auth/refresh
 */
export const refreshTokenHandler = (request: any): Token => {
  const { refresh_token } = request.body;

  if (!refresh_token) {
    throw createMockError(422, {
      detail: 'Refresh token is required',
    });
  }

  // In mock mode, any refresh token works
  // But we'll validate it's similar to our mock format
  if (!refresh_token.includes('mock-refresh-token')) {
    throw createMockError(401, {
      detail: 'Invalid refresh token',
    });
  }

  // Use current user or default to admin
  const user = currentMockUser || getDemoUser('admin@kuilinga.com')!;

  // Generate new tokens
  const accessToken = `${MOCK_CONFIG.mockAccessToken}-${Date.now()}`;
  const newRefreshToken = `${MOCK_CONFIG.mockRefreshToken}-${Date.now()}`;

  currentMockAccessToken = accessToken;
  currentMockRefreshToken = newRefreshToken;

  const response: Token = {
    access_token: accessToken,
    refresh_token: newRefreshToken,
    token_type: 'bearer',
    user,
  };

  return response;
};

/**
 * GET /api/v1/auth/me
 */
export const getCurrentUserHandler = (request: any): UserInLogin => {
  const authHeader = request.headers['authorization'] || request.headers['Authorization'];

  if (!authHeader) {
    throw createMockError(401, {
      detail: 'Not authenticated',
    });
  }

  const token = authHeader.replace('Bearer ', '');

  // Validate token format
  if (!token.includes('mock')) {
    throw createMockError(401, {
      detail: 'Invalid token',
    });
  }

  // Return current mock user or default admin
  const user = currentMockUser || getDemoUser('admin@kuilinga.com')!;

  return user;
};

/**
 * POST /api/v1/auth/logout
 */
export const logoutHandler = (request: any): { message: string } => {
  // Clear current session
  currentMockUser = null;
  currentMockAccessToken = null;
  currentMockRefreshToken = null;

  return { message: 'Successfully logged out' };
};

/**
 * Export auth handlers
 */
export const authHandlers = [
  {
    method: 'POST',
    pattern: '/api/v1/auth/login',
    handler: loginHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/auth/refresh',
    handler: refreshTokenHandler,
  },
  {
    method: 'GET',
    pattern: '/api/v1/auth/me',
    handler: getCurrentUserHandler,
  },
  {
    method: 'POST',
    pattern: '/api/v1/auth/logout',
    handler: logoutHandler,
  },
];
