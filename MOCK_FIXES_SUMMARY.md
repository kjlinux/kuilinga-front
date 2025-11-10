# Mock Data TypeScript Fixes Summary

## Completed Fixes

### 1. ✅ devices.mock.ts
- Added `DeviceInternal` interface with flat structure (site_id)
- Created `enrichDevice()` function to convert to nested Device type
- Updated `paginate()` calls to use `pageToSkipLimit(page, page_size)`
- Removed: name, model, location fields
- Kept: id, serial_number, type, status, site_id (internal)
- API type returns: site object, organization object nested

### 2. ✅ organizations.mock.ts
- Added `OrganizationInternal` interface
- Changed `phone_number` → `phone`
- Created `enrichOrganization()` with lazy imports to avoid circular dependencies
- Updated pagination to use `pageToSkipLimit()`

### 3. ✅ permissions.mock.ts
- Removed `resource` and `action` properties (not in API type)
- Updated search fields
- Updated pagination to use `pageToSkipLimit()`

### 4. ✅ roles.mock.ts
- Updated pagination to use `pageToSkipLimit()`

## Remaining Fixes Needed

### 5. sites.mock.ts
**Current issues:**
- Uses flat `organization_id`, `phone_number`, `is_active`, `created_at`, `updated_at`
- API type Site expects nested `organization` object

**Required changes:**
```typescript
interface SiteInternal {
  id: string;
  name: string;
  organization_id: string;
  address?: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const enrichSite = (site: SiteInternal): Site => ({
  id: site.id,
  name: site.name,
  address: site.address || null,
  timezone: site.timezone,
  organization: {
    id: org.id,
    name: org.name,
    description: org.description,
    email: org.email,
    phone: org.phone,
    timezone: org.timezone,
    plan: org.plan,
    is_active: org.is_active,
  },
  departments_count,
  employees_count,
  devices_count,
});
```
- Update pagination calls

### 6. departments.mock.ts
**Current issues:**
- Uses flat `site_id`, `manager_id`
- API type Department expects nested `site` and `manager` objects

**Required changes:**
```typescript
interface DepartmentInternal {
  id: string;
  name: string;
  site_id: string;
  manager_id?: string | null;
}

const enrichDepartment = (dept: DepartmentInternal): Department => ({
  id: dept.id,
  name: dept.name,
  site: {
    id: site.id,
    name: site.name,
  },
  manager: manager ? {
    id: manager.id,
    first_name: manager.first_name,
    last_name: manager.last_name,
    full_name: `${manager.first_name} ${manager.last_name}`,
  } : null,
  employees_count,
});
```
- Update pagination calls

### 7. employees.mock.ts
**Current issues:**
- Uses `phone_number` → should be `phone`
- Uses `is_active` → should be `status` (string: "active", "inactive")
- Uses `registration_number` → should be `employee_number`
- Uses flat `department_id`, `site_id`, `organization_id`
- API type expects nested objects

**Required changes:**
```typescript
interface EmployeeInternal {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  employee_number?: string | null;
  position?: string | null;
  badge_id?: string | null;
  department_id?: string | null;
  hire_date?: string;
  status: string; // "active" or "inactive"
  created_at: string;
  updated_at: string;
}

const enrichEmployee = (emp: EmployeeInternal): Employee => ({
  id: emp.id,
  first_name: emp.first_name,
  last_name: emp.last_name,
  email: emp.email,
  phone: emp.phone || null,
  employee_number: emp.employee_number || null,
  position: emp.position || null,
  badge_id: emp.badge_id || null,
  status: emp.status,
  department: dept ? {
    id: dept.id,
    name: dept.name,
  } : null,
  site: site ? {
    id: site.id,
    name: site.name,
    address: site.address,
    timezone: site.timezone,
  } : null,
  organization: org ? {
    id: org.id,
    name: org.name,
    description: org.description,
    email: org.email,
    phone: org.phone,
    timezone: org.timezone,
    plan: org.plan,
    is_active: org.is_active,
  } : null,
  user: user ? {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone_number: user.phone_number,
    organization_id: user.organization_id,
    is_active: user.is_active,
  } : null,
});
```
- Update pagination calls

### 8. leaves.mock.ts
**Current issues:**
- Uses flat `employee_id`, `approved_by`
- Missing `duration` field (needs calculation)
- API type expects nested `employee` and `approver` objects

**Required changes:**
```typescript
interface LeaveInternal {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  notes?: string | null;
  status: LeaveStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  comments?: string | null;
  created_at: string;
  updated_at: string;
}

const enrichLeave = (leave: LeaveInternal): Leave => {
  const startDate = new Date(leave.start_date);
  const endDate = new Date(leave.end_date);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    id: leave.id,
    leave_type: leave.leave_type,
    start_date: leave.start_date,
    end_date: leave.end_date,
    reason: leave.reason,
    notes: leave.notes || null,
    status: leave.status,
    duration,
    employee: emp ? {
      id: emp.id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      department: dept ? { id: dept.id, name: dept.name } : null,
      full_name: `${emp.first_name} ${emp.last_name}`,
    } : null,
    approver: approver ? {
      id: approver.id,
      full_name: `${approver.first_name} ${approver.last_name}`,
    } : null,
  };
};
```
- Update pagination calls

### 9. attendance.mock.ts
**Current issues:**
- Uses flat `employee_id`, `device_id`
- API type expects nested `employee` and `device` objects
- Device object needs `type` field (not just id and serial_number)

**Required changes:**
```typescript
interface AttendanceInternal {
  id: string;
  employee_id: string;
  device_id: string;
  timestamp: string;
  type: AttendanceType;
  geo?: string | null;
  extra_data?: Record<string, unknown> | null;
  created_at: string;
}

const enrichAttendance = (att: AttendanceInternal): Attendance => ({
  id: att.id,
  timestamp: att.timestamp,
  type: att.type,
  geo: att.geo || null,
  extra_data: att.extra_data || null,
  duration: null, // Calculate if needed
  employee: emp ? {
    id: emp.id,
    first_name: emp.first_name,
    last_name: emp.last_name,
    employee_number: emp.employee_number,
  } : null,
  device: device ? {
    id: device.id,
    serial_number: device.serial_number,
    type: device.type, // IMPORTANT: needs type field
  } : null,
});
```
- Update pagination calls

### 10. users.mock.ts
**Current issues:**
- Uses flat `role_ids` array
- API type expects nested `roles` array with full Role objects

**Required changes:**
```typescript
interface UserInternal {
  id: string;
  email: string;
  full_name?: string | null;
  phone_number?: string | null;
  organization_id?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  role_ids: string[];
  created_at: string;
  updated_at: string;
}

const enrichUser = (user: UserInternal): User => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name || null,
  phone_number: user.phone_number || null,
  organization_id: user.organization_id || null,
  is_active: user.is_active,
  is_superuser: user.is_superuser,
  roles: user.role_ids
    .map(id => mockRoles.find(r => r.id === id))
    .filter((r): r is Role => r !== undefined),
});
```
- Update pagination calls

## Universal Changes for All Files

1. **Import pageToSkipLimit**:
   ```typescript
   import { paginate, filterBySearch, pageToSkipLimit } from '../utils/pagination';
   ```

2. **Update all paginate() calls**:
   ```typescript
   // OLD:
   return paginate(items, { page: parseInt(page) || 1, page_size: parseInt(page_size) || 10 });

   // NEW:
   return paginate(items, pageToSkipLimit(page, page_size));
   ```

3. **Pattern for enrichment**:
   - Create `*Internal` interface with flat structure (IDs only)
   - Create `enrich*()` function that:
     - Finds related entities
     - Nests them as objects
     - Returns API-compliant type
   - Use enrichment in handlers before returning

4. **Export pattern**:
   ```typescript
   // Export internal data for other mocks to import
   export const mockEntities = mockEntitiesInternal;

   // Or export enriched if needed by other mocks
   export const mockEntities = mockEntitiesInternal.map(enrich);
   ```

## Page Component Fixes

### Leaves.tsx
- Change `employee.full_name` → compute from `employee.first_name + employee.last_name`
- Or use the nested `employee.full_name` property if present

### Employees.tsx
- Compute `full_name` as `${employee.first_name} ${employee.last_name}`
- Don't access `employee.full_name` directly (not in Employee type)

## handlers/index.ts
- Check MockHandler type definition
- Ensure pattern property accepts both string and RegExp

## Testing After Fixes
```bash
npx tsc --noEmit
```
Should show zero TypeScript errors in mock files.
