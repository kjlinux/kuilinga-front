# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KUILINGA is a modern attendance management system frontend built with React, TypeScript, and Vite. It connects to a FastAPI backend and manages multi-organization attendance tracking with role-based access control.

**Stack**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, React Query, React Router, Axios

## Development Commands

```bash
# Install dependencies (uses npm, pnpm recommended in README)
npm install

# Development server (runs on port 3000)
npm run dev

# Production build (compiles TypeScript first, then builds)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)
- `VITE_USE_MOCK_API`: Set to `true` to use mock data instead of real backend (default: false)
- API requests to `/api/*` are proxied to the backend in development (see [vite.config.ts](vite.config.ts#L14-L19))

### Mock API System

The project includes a comprehensive mock data system for development, demos, and testing without a backend:

- **Enable**: Set `VITE_USE_MOCK_API=true` in `.env`
- **Demo Credentials**: Use `admin@kuilinga.com` / `demo123` (or any demo account from MOCK_SYSTEM.md)
- **Documentation**: See [MOCK_SYSTEM.md](MOCK_SYSTEM.md) for complete details
- **Location**: [src/mocks/](src/mocks/) directory contains all mock infrastructure
- **Coverage**: All API endpoints have mock handlers with realistic data
- **Features**: CRUD operations, pagination, search, auth flow, ~1000+ records

Mock data includes:
- 5 organizations, 15 sites, 33 departments
- 30 employees, 10 users, 15 devices
- 1000+ attendance records, 5 leave requests
- Dashboard data for all 4 role types
- Realistic French names and addresses

## Architecture

### Authentication Flow

1. **JWT-based**: Access token + refresh token stored in localStorage
2. **AuthContext** ([src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)): Provides `user`, `login`, `logout`, `updateUser`
3. **API Interceptors** ([src/services/api.service.ts](src/services/api.service.ts)):
   - Request interceptor adds Bearer token to all requests
   - Response interceptor handles 401 (refresh token flow) and 403 (invalid credentials → logout)
4. **PrivateRoute** ([src/components/PrivateRoute.tsx](src/components/PrivateRoute.tsx)): Wraps protected routes, redirects to `/login` if unauthenticated

### API Service Layer

**Central service**: [src/services/api.service.ts](src/services/api.service.ts) exports singleton `apiService` with methods: `get`, `post`, `put`, `patch`, `delete`

**Specialized services** (in [src/services/](src/services/)):
- `auth.service.ts`: Login, logout, getCurrentUser, forgot password
- `employee.service.ts`: CRUD employees
- `attendance.service.ts`: Attendance tracking
- `report.service.ts`: Report generation
- `organization.service.ts`, `site.service.ts`, `department.service.ts`: Org hierarchy
- `user.service.ts`, `role.service.ts`, `permission.service.ts`: Access control
- `device.service.ts`, `leave.service.ts`, `notification.service.ts`: Devices, leaves, notifications
- `dashboard.service.ts`: Dashboard data per role

**API endpoints**: Defined in [src/config/api.ts](src/config/api.ts)

### Type System

**All types** are centralized in [src/types/index.ts](src/types/index.ts) (931 lines, auto-generated from OpenAPI spec).

Key entities:
- `User`, `UserRole` (enum: super-admin, admin-organization, rh, manager, employee)
- `Organization`, `Site`, `Department`, `Employee`
- `Attendance`, `AttendanceType` (in/out)
- `Leave`, `LeaveType`, `LeaveStatus`
- `Device`, `DeviceStatus`
- `Role`, `Permission`
- Dashboard types: `AdminDashboard`, `ManagerDashboard`, `EmployeeDashboard`, `IntegratorDashboard`
- Report types: 20 report request/response interfaces (R1-R20)

**Pagination**: Generic `PaginatedResponse<T>` and `PaginationParams` types

### State Management

- **React Query**: Used for server state (`@tanstack/react-query`)
- **Context API**:
  - `AuthContext` for authentication state
  - `NotificationContext` ([src/contexts/NotificationContext.tsx](src/contexts/NotificationContext.tsx)) for notifications
  - `FormContext` ([src/contexts/FormContext.tsx](src/contexts/FormContext.tsx)) for form state management

### Routing Structure

Defined in [src/App.tsx](src/App.tsx):
- `/login`: Public route
- Protected routes (wrapped in `PrivateRoute` and `Layout`):
  - `/dashboard`: Role-based dashboards
  - `/attendance`: Attendance tracking
  - `/reports`: Report generation
  - `/employees`: Employee management
  - `/organizations`, `/sites`, `/departments`: Organization hierarchy
  - `/devices`: Device management
  - `/leaves`: Leave requests
  - `/users`, `/roles`, `/permissions`: Access control
  - `/settings`: User settings

### Component Architecture

**Layout components**:
- [Layout.tsx](src/components/Layout.tsx): Main layout with header and sidebar
- [Header.tsx](src/components/Header.tsx): Top navigation
- [Sidebar.tsx](src/components/Sidebar.tsx): Side navigation

**Dialog components** (CRUD forms):
- `EmployeeDialog`, `UserDialog`, `RoleDialog`, `OrganizationDialog`, `SiteDialog`, `DepartmentDialog`, `DeviceDialog`, `LeaveDialog`
- Follow pattern: receive `open`, `onOpenChange`, `onSuccess`, optional `initialData` props

**Dashboard components** ([src/components/dashboards/](src/components/dashboards/)):
- `AdminDashboard`: Multi-org metrics, device status, plan distribution
- `ManagerDashboard`: Team presence, attendance rate, real-time attendances
- `EmployeeDashboard`: Personal attendances, leave balance
- `IntegratorDashboard`: Device metrics

**Report components** ([src/components/reports/](src/components/reports/)):
- `ReportFilters`: Dynamic filter builder based on report config
- `ReportPreview`: Displays report data
- Preview components in [src/components/reports/previews/](src/components/reports/previews/) (R1-R19)

**UI components**: shadcn/ui components in [src/components/ui/](src/components/ui/) (button, dialog, input, table, select, etc.)

### Custom Hooks

- **useAuth** ([src/hooks/useAuth.ts](src/hooks/useAuth.ts)): Access auth context
- **useNotification** ([src/hooks/useNotification.ts](src/hooks/useNotification.ts)): Access notification context
- **useDataTable** ([src/hooks/useDataTable.ts](src/hooks/useDataTable.ts)): Generic hook for paginated data tables
  - Handles loading, error, pagination, search, refresh
  - Used across all list pages (Employees, Users, Organizations, etc.)
- **useFormField** ([src/hooks/useFormField.ts](src/hooks/useFormField.ts)): Form field utilities

### Reports System

**Configuration**: [src/config/reports.config.ts](src/config/reports.config.ts) defines 20 reports (R1-R20) with:
- `id`, `title`, `description`, `roles` (who can access), `filters`, `previewEndpoint`, `downloadEndpoint`

**Role-based reports**:
- **Super Admin/Admin Org**: R1-R4 (multi-org, comparative analysis, device usage, user audit)
- **Admin Org/RH**: R5-R11 (org presence, monthly synthetic, absence analysis, anomalies, worked hours, site activity, payroll export)
- **Manager**: R12-R16 (dept presence, team weekly, hours validation, leave requests, team performance)
- **Employee**: R17-R20 (my presence, monthly summary, my leaves, presence certificate)

**Filter types**: Date ranges, periods, organizations, sites, departments, employees, metrics, leave types/statuses, etc.

### Styling

- **TailwindCSS**: Main styling framework
- **Custom theme** ([src/index.css](src/index.css)): CSS variables for primary (#703D57), secondary (#272635), accent (#A6A6A8), light (#CECECE), background (#E8E9F3)
- **Path alias**: `@/` → `./src/` (configured in [tsconfig.json](tsconfig.json#L19-L21) and [vite.config.ts](vite.config.ts#L8-L10))

## Key Patterns

### Adding a New Entity

1. **Types**: Ensure entity types exist in [src/types/index.ts](src/types/index.ts) (typically auto-generated from API spec)
2. **Service**: Create `[entity].service.ts` in [src/services/](src/services/) with CRUD methods using `apiService`
3. **Page**: Create page in [src/pages/](src/pages/) using `useDataTable` hook
4. **Dialog**: Create `[Entity]Dialog.tsx` in [src/components/](src/components/) for create/edit forms
5. **Route**: Add route in [src/App.tsx](src/App.tsx)
6. **Navigation**: Add menu item in [Sidebar.tsx](src/components/Sidebar.tsx)

### Error Handling

- API errors are caught in service methods and thrown up to components
- 401 errors trigger token refresh automatically
- 403 errors with "Could not validate credentials" trigger logout and redirect to `/login`
- Component-level error handling typically uses try-catch with notification display

### Data Fetching Pattern

Most list pages follow this pattern:
```typescript
const { data, isLoading, error, pagination, handlePageChange, handleSearchChange, refresh } = useDataTable({
  fetchData: entityService.getAll
})
```

### Form Handling

- React Hook Form with Zod validation (see `@hookform/resolvers`, `zod` in dependencies)
- Forms typically wrapped in Dialog components
- Success callbacks trigger parent refresh

## Backend Integration

- **API Base**: Configured via `VITE_API_URL` environment variable
- **Versioned endpoints**: All endpoints use `/api/v1/` prefix
- **Response format**: Backend returns `PaginatedResponse` for lists, individual entities for single items
- **DateTime format**: ISO 8601 strings (parsed/formatted with `date-fns`)

## Special Considerations

- **Multi-tenancy**: System supports multiple organizations with hierarchy (Organization → Site → Department)
- **Role-based UI**: Dashboard page currently shows all dashboards; production should filter by user role
- **Device integration**: System tracks attendance via physical devices (biometric readers, etc.)
- **Timezone handling**: Organizations and sites have timezone fields
- **Leave workflow**: Leaves have approval workflow (pending → approved/rejected/cancelled)
- **Report generation**: Reports can be previewed (JSON) or downloaded (PDF/Excel/CSV)
