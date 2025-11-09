# Mock System Documentation

## Overview

The KUILINGA frontend includes a comprehensive mock data system that allows the application to run without a backend connection. This is ideal for:

- **Client demos**: Showcase the UI/UX without backend infrastructure
- **Development**: Frontend developers can work independently
- **Testing**: Automated testing with predictable data
- **Presentations**: Reliable demos that work offline

## Quick Start

### Enabling Mock Mode

1. Set the environment variable in `.env`:
   ```env
   VITE_USE_MOCK_API=true
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

3. The application will now use mock data instead of making real API calls.

### Demo Credentials

You can log in with any of these demo accounts:

| Email | Password | Role |
|-------|----------|------|
| `superadmin@kuilinga.com` | `demo123` | Super Admin |
| `admin@kuilinga.com` | `demo123` | Admin Organization |
| `rh@kuilinga.com` | `demo123` | RH (Human Resources) |
| `manager@kuilinga.com` | `demo123` | Manager |
| `employee@kuilinga.com` | `demo123` | Employee |

**Note**: In mock mode, ANY email/password combination will work, but using the demo credentials ensures you get the correct role and permissions.

## Architecture

### How It Works

The mock system uses an **Axios interceptor pattern**:

```
User Action → API Service → Mock Interceptor → Mock Handler → Mock Data → Response
                                  ↓ (if VITE_USE_MOCK_API=false)
                              Real Backend API
```

1. **Interceptor** ([src/mocks/interceptor.ts](src/mocks/interceptor.ts)): Intercepts ALL Axios requests
2. **Handler Registry** ([src/mocks/handlers/index.ts](src/mocks/handlers/index.ts)): Routes requests to appropriate handlers
3. **Data Stores** ([src/mocks/data/*.mock.ts](src/mocks/data/)): In-memory data stores with CRUD operations
4. **Utilities** ([src/mocks/utils/](src/mocks/utils/)): Pagination, filtering, delay simulation

### Key Features

✅ **Full CRUD support**: Create, Read, Update, Delete operations work in-memory
✅ **Realistic delays**: 200-500ms network latency simulation
✅ **Pagination**: Client-side pagination matching backend format
✅ **Search/filtering**: Client-side search across relevant fields
✅ **Token-based auth**: Mock JWT tokens with proper flow
✅ **Error handling**: Simulates 401, 403, 404, 422 errors
✅ **Type-safe**: Full TypeScript support

## Mock Data

### Organizations

- **5 organizations**: TechCorp, InnovateLab, GlobalServices, DataTech Solutions, CloudNet Systems
- **15 sites** across France (Paris, Lyon, Marseille, Toulouse, etc.)
- **33 departments** (IT, HR, Sales, Marketing, etc.)

### Employees

- **30 employees** with realistic French names
- Multiple job titles and departments
- Hire dates spanning 2022-2024

### Users

- **10 users** with different roles
- Linked to organizations and employees

### Attendance

- **1000+ attendance records** for the last 30 days
- Clock-in/clock-out pairs
- Realistic working hours (8-10 AM to 5-8 PM)

### Devices

- **15 biometric readers** and badge scanners
- Different statuses: Online (20), Offline (3), Maintenance (2)
- Distributed across sites

### Leaves

- **5 leave requests** with different statuses
- Types: Annual, Sick, Maternity, Paternity, Unpaid, Other
- Statuses: Pending, Approved, Rejected, Cancelled

### Dashboards

Mock data for all 4 dashboard types:
- **Admin Dashboard**: Multi-org stats, device status, attendance trends
- **Manager Dashboard**: Team presence, attendance rate, work hours
- **Employee Dashboard**: Personal attendance, leave balance, recent activity
- **Integrator Dashboard**: Device metrics, sync status, errors

## File Structure

```
src/mocks/
├── index.ts                      # Main export file
├── config.ts                     # Configuration (delays, tokens, credentials)
├── interceptor.ts                # Axios interceptor logic
├── handlers/
│   └── index.ts                  # Centralized handler registry
├── data/
│   ├── auth.mock.ts             # Authentication handlers
│   ├── users.mock.ts            # User CRUD handlers
│   ├── employees.mock.ts        # Employee CRUD handlers
│   ├── organizations.mock.ts    # Organization CRUD handlers
│   ├── sites.mock.ts            # Site CRUD handlers
│   ├── departments.mock.ts      # Department CRUD handlers
│   ├── devices.mock.ts          # Device CRUD handlers
│   ├── leaves.mock.ts           # Leave CRUD handlers
│   ├── attendance.mock.ts       # Attendance handlers
│   ├── roles.mock.ts            # Role CRUD handlers
│   ├── permissions.mock.ts      # Permission CRUD handlers
│   ├── dashboard.mock.ts        # Dashboard data handlers
│   ├── reports.mock.ts          # Report generation handlers
│   └── notifications.mock.ts    # Notification handlers
└── utils/
    ├── delay.ts                 # Network delay simulation
    ├── pagination.ts            # Pagination utilities
    └── generators.ts            # Data generation helpers
```

## API Endpoints Coverage

### Authentication ✅
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

### Users ✅
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `POST /api/v1/users/:id/roles/:role_id`

### Employees ✅
- `GET /api/v1/employees`
- `GET /api/v1/employees/:id`
- `POST /api/v1/employees`
- `PUT /api/v1/employees/:id`
- `DELETE /api/v1/employees/:id`
- `POST /api/v1/employees/import`

### Organizations ✅
- `GET /api/v1/organizations`
- `GET /api/v1/organizations/:id`
- `POST /api/v1/organizations`
- `PUT /api/v1/organizations/:id`
- `DELETE /api/v1/organizations/:id`

### Sites ✅
- `GET /api/v1/sites`
- `GET /api/v1/sites/:id`
- `POST /api/v1/sites`
- `PUT /api/v1/sites/:id`
- `DELETE /api/v1/sites/:id`

### Departments ✅
- `GET /api/v1/departments`
- `GET /api/v1/departments/:id`
- `POST /api/v1/departments`
- `PUT /api/v1/departments/:id`
- `DELETE /api/v1/departments/:id`

### Devices ✅
- `GET /api/v1/devices`
- `GET /api/v1/devices/:id`
- `POST /api/v1/devices`
- `PUT /api/v1/devices/:id`
- `DELETE /api/v1/devices/:id`

### Leaves ✅
- `GET /api/v1/leaves`
- `GET /api/v1/leaves/:id`
- `POST /api/v1/leaves`
- `PUT /api/v1/leaves/:id`
- `DELETE /api/v1/leaves/:id`

### Attendance ✅
- `GET /api/v1/attendances`
- `POST /api/v1/attendances`
- `POST /api/v1/attendances/clock`

### Roles ✅
- `GET /api/v1/roles`
- `GET /api/v1/roles/:id`
- `POST /api/v1/roles`
- `PUT /api/v1/roles/:id`
- `DELETE /api/v1/roles/:id`
- `GET /api/v1/roles/:id/permissions`
- `POST /api/v1/roles/:id/permissions/:permission_id`

### Permissions ✅
- `GET /api/v1/permissions`
- `GET /api/v1/permissions/:id`
- `POST /api/v1/permissions`
- `PUT /api/v1/permissions/:id`
- `DELETE /api/v1/permissions/:id`

### Dashboards ✅
- `GET /api/v1/dashboards/admin`
- `GET /api/v1/dashboards/manager`
- `GET /api/v1/dashboards/employee`
- `GET /api/v1/dashboards/integrator`

### Reports ✅
- `POST /api/v1/reports/preview`
- `POST /api/v1/reports/download`

### Notifications ✅
- `GET /api/v1/notifications`
- `PUT /api/v1/notifications/:id/read`
- `PUT /api/v1/notifications/read-all`
- `DELETE /api/v1/notifications/:id`

## Usage Examples

### Adding New Mock Data

To add more employees:

```typescript
// src/mocks/data/employees.mock.ts
export const mockEmployees: Employee[] = [
  // ... existing employees
  {
    id: randomUUID(),
    first_name: 'Nouveau',
    last_name: 'Employé',
    email: 'nouveau.employe@kuilinga.com',
    // ... other fields
  },
];
```

### Adding New Endpoints

1. Create handler in appropriate mock file:

```typescript
// src/mocks/data/custom.mock.ts
export const customHandler = [
  {
    method: 'GET',
    pattern: '/api/v1/custom/endpoint',
    handler: (request: any) => {
      return { message: 'Custom response' };
    },
  },
];
```

2. Register in handlers/index.ts:

```typescript
import { customHandler } from '../data/custom.mock';

export const mockHandlers: MockHandler[] = [
  // ... existing handlers
  ...customHandler,
];
```

### Simulating Errors

```typescript
import { createMockError } from '../interceptor';

// In any handler:
if (someCondition) {
  throw createMockError(400, { detail: 'Custom error message' });
}
```

## Debugging

Enable detailed logging in `src/mocks/config.ts`:

```typescript
export const MOCK_CONFIG = {
  // ...
  logRequests: true,   // Log all intercepted requests
  logResponses: true,  // Log all mock responses
};
```

View registered handlers in console:

```typescript
import { logRegisteredHandlers } from '@/mocks';

logRegisteredHandlers(); // Prints all registered handlers
```

## Testing

The mock system is perfect for automated testing:

```typescript
import { resetUsersStore, mockUsers } from '@/mocks';

describe('Users Page', () => {
  beforeEach(() => {
    resetUsersStore(); // Reset to initial state
  });

  test('displays users list', () => {
    expect(mockUsers).toHaveLength(10);
  });
});
```

## Deployment (Vercel)

### Branch Strategy

- **main**: Uses real backend API (`VITE_USE_MOCK_API=false`)
- **demo/mock-data**: Uses mock data (`VITE_USE_MOCK_API=true`)

### Vercel Configuration

1. Connect repository to Vercel
2. Create deployment for `demo/mock-data` branch
3. Add environment variable:
   - Key: `VITE_USE_MOCK_API`
   - Value: `true`
4. Deploy!

The demo site will run entirely on mock data with no backend required.

## Limitations

### What Mock System Does NOT Support

❌ **Real-time updates**: WebSocket connections
❌ **File uploads**: Actual file processing
❌ **Server-side computation**: Complex business logic
❌ **External integrations**: Third-party APIs
❌ **Database transactions**: Atomic operations

### Workarounds

- **File uploads**: Returns success immediately with mock file reference
- **Reports download**: Returns mock blob URL (no actual PDF/Excel)
- **Real-time**: Data refreshes on page reload only

## Troubleshooting

### Mock mode not activating

1. Check `.env` file: `VITE_USE_MOCK_API=true`
2. Restart dev server after changing env vars
3. Check console for `[MOCK] Mock interceptor enabled` message

### Handlers not found

1. Check handler pattern matches request URL exactly
2. URL parameters use `:param` syntax (e.g., `/users/:id`)
3. Run `logRegisteredHandlers()` to see all handlers

### Data not persisting

Mock data is stored in memory and resets on:
- Page reload
- Dev server restart
- Switching between pages

This is by design for consistent demo experience.

## Contributing

When adding new features that require API calls:

1. Create mock handler in appropriate `data/*.mock.ts` file
2. Add handler to `handlers/index.ts`
3. Add realistic mock data
4. Test both mock and real API modes
5. Update this documentation

## Support

For issues or questions:
- Check console logs (`[MOCK]` prefix)
- Review handler patterns in `src/mocks/handlers/index.ts`
- Ensure TypeScript types match between mock and real data
- Verify environment variable is set correctly

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Maintainer**: Claude Code
