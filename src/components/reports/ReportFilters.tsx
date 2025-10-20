import { FilterType } from "@/config/reports.config";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { SelectFilter } from "./filters/SelectFilter";
import { LeaveType, LeaveStatus, Organization, Site, Department, Employee } from "@/types";
import filterService from "@/services/filter.service";
import { subDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface ReportFiltersProps {
  filters: FilterType[];
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export const ReportFilters = ({ filters, onFilterChange }: ReportFiltersProps) => {
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>({});
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { user } = useAuth();

  const updateFilter = useCallback((key: string, value: unknown) => {
    setCurrentFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const initialFilters: Record<string, unknown> = {};
    const today = new Date();

    filters.forEach(filter => {
      switch (filter) {
        case FilterType.DateRange:
          initialFilters["start_date"] = subDays(today, 30);
          initialFilters["end_date"] = today;
          break;
        case FilterType.Year:
          initialFilters["year"] = today.getFullYear();
          break;
        case FilterType.Month:
          initialFilters["month"] = today.getMonth() + 1;
          break;
      }
    });
    setCurrentFilters(initialFilters);
  }, [filters]);

  useEffect(() => {
    onFilterChange(currentFilters);
  }, [currentFilters, onFilterChange]);

  const fetchAndSetOrganizations = useCallback(async () => {
    if (!filters.includes(FilterType.Organization)) return;

    try {
      const orgs = await filterService.getOrganizations();
      setOrganizations(orgs);

      const orgIdToSelect = user?.organization_id ?? orgs[0]?.id;
      if (orgIdToSelect) {
        updateFilter("organization_id", orgIdToSelect);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  }, [filters, user?.organization_id, updateFilter]);

  const fetchAndSetSites = useCallback(async (organizationId: string) => {
    if (!filters.includes(FilterType.Site)) return;

    try {
      const sitesData = await filterService.getSites(organizationId);
      setSites(sitesData);
      updateFilter("site_id", sitesData[0]?.id ?? null);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
      setSites([]);
      updateFilter("site_id", null);
    }
  }, [filters, updateFilter]);

  const fetchAndSetDepartments = useCallback(async (siteId: string) => {
    if (!filters.includes(FilterType.Department)) return;

    try {
      const depts = await filterService.getDepartments(siteId);
      setDepartments(depts);
      updateFilter("department_id", depts[0]?.id ?? null);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([]);
      updateFilter("department_id", null);
    }
  }, [filters, updateFilter]);

  const fetchAndSetEmployees = useCallback(async (departmentId: string) => {
    if (!filters.includes(FilterType.Employee)) return;

    try {
      const emps = await filterService.getEmployees(departmentId);
      setEmployees(emps);
      updateFilter("employee_id", emps[0]?.id ?? null);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
      updateFilter("employee_id", null);
    }
  }, [filters, updateFilter]);

  // Main data fetching orchestrator
  useEffect(() => {
    fetchAndSetOrganizations();
  }, [fetchAndSetOrganizations]);

  useEffect(() => {
    const orgId = currentFilters.organization_id as string | undefined;
    if (orgId) {
      fetchAndSetSites(orgId);
    } else {
      setSites([]);
      setDepartments([]);
      setEmployees([]);
    }
  }, [currentFilters.organization_id, fetchAndSetSites]);

  useEffect(() => {
    const siteId = currentFilters.site_id as string | undefined;
    if (siteId) {
      fetchAndSetDepartments(siteId);
    } else {
      setDepartments([]);
      setEmployees([]);
    }
  }, [currentFilters.site_id, fetchAndSetDepartments]);

  useEffect(() => {
    const deptId = currentFilters.department_id as string | undefined;
    if (deptId) {
      fetchAndSetEmployees(deptId);
    } else {
      setEmployees([]);
    }
  }, [currentFilters.department_id, fetchAndSetEmployees]);

  const handleFilterChange = (filterKey: string, value: string | string[] | null) => {
    updateFilter(filterKey, value);

    // Reset dependent filters
    if (filterKey === "organization_id") {
      updateFilter("site_id", null);
      updateFilter("department_id", null);
      updateFilter("employee_id", null);
    } else if (filterKey === "site_id") {
      updateFilter("department_id", null);
      updateFilter("employee_id", null);
    } else if (filterKey === "department_id") {
      updateFilter("employee_id", null);
    }
  };

  const renderFilter = (filterType: FilterType) => {
    switch (filterType) {
      case FilterType.DateRange:
        return (
          <div key={filterType} className="space-y-2">
            <Label>Plage de dates</Label>
            <DateRangePicker
              onUpdate={({ range }: { range: DateRange }) => {
                updateFilter("start_date", range.from);
                updateFilter("end_date", range.to);
              }}
              initialDateFrom={currentFilters.start_date as Date | undefined}
              initialDateTo={currentFilters.end_date as Date | undefined}
            />
          </div>
        );
      case FilterType.Organization:
        return <SelectFilter key={filterType} label="Organisation" placeholder="Sélectionnez une organisation" options={organizations.map(o => ({ value: o.id, label: o.name }))} onChange={value => handleFilterChange("organization_id", value)} value={currentFilters.organization_id as string ?? ""} />;
      case FilterType.Site:
        return <SelectFilter key={filterType} label="Site" placeholder="Sélectionnez un site" options={sites.map(s => ({ value: s.id, label: s.name }))} onChange={value => handleFilterChange("site_id", value)} value={currentFilters.site_id as string ?? ""} />;
      case FilterType.Department:
        return <SelectFilter key={filterType} label="Département" placeholder="Sélectionnez un département" options={departments.map(d => ({ value: d.id, label: d.name }))} onChange={value => handleFilterChange("department_id", value)} value={currentFilters.department_id as string ?? ""} />;
      case FilterType.Employee:
        return <SelectFilter key={filterType} label="Employé" placeholder="Sélectionnez un employé" options={employees.map(e => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }))} onChange={value => updateFilter("employee_id", value)} value={ currentFilters.employee_id as string ?? ""} />;
      case FilterType.LeaveType:
        return <SelectFilter key={filterType} label="Type de congé" placeholder="Sélectionnez un type" options={Object.values(LeaveType).map(lt => ({ value: lt, label: lt }))} onChange={value => updateFilter("leave_type", value)} />;
      case FilterType.LeaveStatus:
        return <SelectFilter key={filterType} label="Statut du congé" placeholder="Sélectionnez un statut" options={Object.values(LeaveStatus).map(ls => ({ value: ls, label: ls }))} onChange={value => updateFilter("status", value)} />;
      case FilterType.Year:
        return (
            <div key={filterType} className="space-y-2">
                <Label>Année</Label>
                <Input type="number" placeholder="Entrez une année" onChange={e => updateFilter("year", parseInt(e.target.value))} value={currentFilters.year as number ?? new Date().getFullYear()} />
            </div>
        );
      case FilterType.Month:
        return (
            <div key={filterType} className="space-y-2">
                <Label>Mois</Label>
                <Input type="number" placeholder="Entrez un mois" onChange={e => updateFilter("month", parseInt(e.target.value))} value={currentFilters.month as number ?? new Date().getMonth() + 1} />
            </div>
        );
      default:
        return (
          <div key={filterType} className="space-y-2">
            <Label>{filterType.replace(/_/g, ' ')}</Label>
            <Input
              placeholder={`Entrez ${filterType.toLowerCase()}`}
              onChange={e => updateFilter(filterType, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
      {filters.map(renderFilter)}
    </div>
  );
};
