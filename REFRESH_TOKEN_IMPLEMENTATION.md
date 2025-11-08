# Token Refresh Implementation

## Overview
The automatic token refresh logic is **fully implemented** in the frontend and ready to use.

## Implementation Details

### Location
[src/services/api.service.ts](src/services/api.service.ts#L50-L83)

### How It Works

1. **Request Interceptor** (lines 17-28)
   - Adds `Authorization: Bearer {access_token}` header to all API requests
   - Retrieves token from `localStorage`

2. **Response Interceptor** (lines 31-87)
   - **403 Handling** (lines 40-48): Invalid credentials → logout immediately
   - **401 Handling** (lines 50-83): Unauthorized → automatic token refresh

### Token Refresh Flow (on 401 error)

```typescript
// Step 1: Detect 401 error
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true  // Prevent infinite loops

  // Step 2: Get refresh token from localStorage
  const refreshToken = localStorage.getItem("refresh_token")

  // Step 3: Call /api/v1/auth/refresh
  const response = await axios.post(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
    { refresh_token: refreshToken },
    { headers: { "Content-Type": "application/json" } }
  )

  // Step 4: Save new access token
  const { access_token } = response.data
  localStorage.setItem("access_token", access_token)

  // Step 5: Retry original request with new token
  originalRequest.headers.Authorization = `Bearer ${access_token}`
  return this.api(originalRequest)
}
```

### Security Features

1. **Prevents Infinite Loops**: Uses `_retry` flag to ensure refresh is only attempted once per request
2. **Direct Axios Call**: Refresh request bypasses interceptors to avoid recursion
3. **Automatic Logout on Failure**: If refresh fails, user is logged out and redirected to `/login`
4. **Blob Error Handling**: Special handling for binary responses

### Error Scenarios

| Scenario | Behavior |
|----------|----------|
| 401 + valid refresh token | Automatically refreshes and retries request |
| 401 + expired refresh token | Logout + redirect to `/login` |
| 401 + no refresh token | Logout + redirect to `/login` |
| 403 + "Could not validate credentials" | Immediate logout + redirect to `/login` |
| 403 + other reasons | Reject error (no logout) |

## Testing the Implementation

### Manual Test

1. Login to the application
2. Wait for access token to expire (or manually expire it in localStorage)
3. Make any API request
4. Observe:
   - Request returns 401
   - Refresh token is called automatically
   - New access token is saved
   - Original request is retried successfully

### Console Monitoring

Open browser DevTools → Network tab:
1. See original request fail with 401
2. See `/api/v1/auth/refresh` called
3. See original request retried with new token

## Configuration

### API Endpoints
Configured in [src/config/api.ts](src/config/api.ts#L9):
```typescript
REFRESH: "/api/v1/auth/refresh"
```

### Expected Backend Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Storage
- Access token: `localStorage.getItem("access_token")`
- Refresh token: `localStorage.getItem("refresh_token")`

## Related Files

- [src/services/api.service.ts](src/services/api.service.ts) - Main interceptor logic
- [src/services/auth.service.ts](src/services/auth.service.ts) - Auth methods (login, logout, refreshToken)
- [src/config/api.ts](src/config/api.ts) - API endpoint configuration
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) - Auth context provider

## Notes

- The implementation follows OAuth 2.0 refresh token flow
- All HTTP methods (GET, POST, PUT, DELETE, PATCH) are protected
- Refresh token rotation is not implemented (backend would need to return new refresh_token)
- Token expiration is handled entirely by the backend (no client-side JWT parsing)
