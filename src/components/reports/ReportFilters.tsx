import { FilterType } from "@/config/reports.config";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { SelectFilter } from "./filters/SelectFilter";
import { LeaveType, LeaveStatus, Organization, Site, Department, Employee } from "@/types";
import filterService from "@/services/filter.service";
import { subDays } from "date-fns";

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

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Prefill and propagate filter changes
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

  // Fetch initial data for independent filters
  useEffect(() => {
    const fetchData = async () => {
      if (filters.includes(FilterType.Organization)) {
        const orgs = await filterService.getOrganizations();
        setOrganizations(orgs);
        if (orgs.length > 0) {
          const orgId = orgs[0].id;
          setSelectedOrgId(orgId);
          updateFilter("organization_ids", [orgId]);
        }
      }
    };
    fetchData();
  }, [filters]);

  // Fetch sites when organization changes
  useEffect(() => {
    if (selectedOrgId && filters.includes(FilterType.Site)) {
      const fetchSites = async () => {
        const sitesData = await filterService.getSites(selectedOrgId);
        setSites(sitesData);
        if (sitesData.length > 0) {
          const siteId = sitesData[0].id;
          setSelectedSiteId(siteId);
          updateFilter("site_ids", [siteId]);
        } else {
            setSelectedSiteId(null);
            setDepartments([]);
            setEmployees([]);
            updateFilter("site_ids", []);
            updateFilter("department_ids", []);
            updateFilter("employee_ids", []);
        }
      };
      fetchSites();
    }
  }, [selectedOrgId, filters]);

  // Fetch departments when site changes
  useEffect(() => {
    if (selectedSiteId && filters.includes(FilterType.Department)) {
      const fetchDepartments = async () => {
        const depts = await filterService.getDepartments(selectedSiteId);
        setDepartments(depts);
        if (depts.length > 0) {
          const deptId = depts[0].id;
          setSelectedDeptId(deptId);
          updateFilter("department_ids", [deptId]);
        } else {
            setSelectedDeptId(null);
            setEmployees([]);
            updateFilter("department_ids", []);
            updateFilter("employee_ids", []);
        }
      };
      fetchDepartments();
    }
  }, [selectedSiteId, filters]);

  // Fetch employees when department changes
  useEffect(() => {
    if (selectedDeptId && filters.includes(FilterType.Employee)) {
      const fetchEmployees = async () => {
        const emps = await filterService.getEmployees(selectedDeptId);
        setEmployees(emps);
        if (emps.length > 0) {
          updateFilter("employee_ids", [emps[0].id]);
        } else {
            updateFilter("employee_ids", []);
        }
      };
      fetchEmployees();
    }
  }, [selectedDeptId, filters]);


  const updateFilter = (key: string, value: unknown) => {
    setCurrentFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    updateFilter("organization_ids", [orgId]);
    // Reset dependent filters
    setSites([]);
    setDepartments([]);
    setEmployees([]);
    setSelectedSiteId(null);
    setSelectedDeptId(null);
    updateFilter("site_ids", []);
    updateFilter("department_ids", []);
    updateFilter("employee_ids", []);
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSiteId(siteId);
    updateFilter("site_ids", [siteId]);
    // Reset dependent filters
    setDepartments([]);
    setEmployees([]);
    setSelectedDeptId(null);
    updateFilter("department_ids", []);
    updateFilter("employee_ids", []);
  };

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    updateFilter("department_ids", [deptId]);
    // Reset dependent filters
    setEmployees([]);
    updateFilter("employee_ids", []);
  };


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
      {filters.map(filterType => {
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
                  initialDateFrom={currentFilters.start_date as Date}
                  initialDateTo={currentFilters.end_date as Date}
                />
              </div>
            );
          case FilterType.Organization:
            return <SelectFilter key={filterType} label="Organisation" placeholder="Sélectionnez une organisation" options={organizations.map(o => ({ value: o.id, label: o.name }))} onChange={handleOrgChange} value={selectedOrgId ?? ""} />;
          case FilterType.Site:
            return <SelectFilter key={filterType} label="Site" placeholder="Sélectionnez un site" options={sites.map(s => ({ value: s.id, label: s.name }))} onChange={handleSiteChange} value={selectedSiteId ?? ""} />;
          case FilterType.Department:
            return <SelectFilter key={filterType} label="Département" placeholder="Sélectionnez un département" options={departments.map(d => ({ value: d.id, label: d.name }))} onChange={handleDeptChange} value={selectedDeptId ?? ""} />;
          case FilterType.Employee:
            return <SelectFilter key={filterType} label="Employé" placeholder="Sélectionnez un employé" options={employees.map(e => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }))} onChange={value => updateFilter("employee_ids", [value])} value={ (currentFilters.employee_ids as string[] | undefined)?.[0] ?? ""} />;
          case FilterType.LeaveType:
            return <SelectFilter key={filterType} label="Type de congé" placeholder="Sélectionnez un type" options={Object.values(LeaveType).map(lt => ({ value: lt, label: lt }))} onChange={value => updateFilter("leave_type", value)} />;
          case FilterType.LeaveStatus:
            return <SelectFilter key={filterType} label="Statut du congé" placeholder="Sélectionnez un statut" options={Object.values(LeaveStatus).map(ls => ({ value: ls, label: ls }))} onChange={value => updateFilter("status", value)} />;
          case FilterType.Year:
            return (
                <div key={filterType} className="space-y-2">
                    <Label>Année</Label>
                    <Input type="number" placeholder="Entrez une année" onChange={e => updateFilter("year", parseInt(e.target.value))} value={currentFilters.year as number ?? ""} />
                </div>
            );
          case FilterType.Month:
            return (
                <div key={filterType} className="space-y-2">
                    <Label>Mois</Label>
                    <Input type="number" placeholder="Entrez un mois" onChange={e => updateFilter("month", parseInt(e.target.value))} value={currentFilters.month as number ?? ""} />
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
      })}
    </div>
  );
};
