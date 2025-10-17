import { FilterType } from "@/config/reports.config";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { SelectFilter } from "./filters/SelectFilter";
import { LeaveType, LeaveStatus, Organization, Site, Department, Employee } from "@/types";
import filterService from "@/services/filter.service";

interface ReportFiltersProps {
  filters: FilterType[];
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export const ReportFilters = ({ filters, onFilterChange }: ReportFiltersProps) => {
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>({});
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sites] = useState<Site[]>([]);
  const [departments] = useState<Department[]>([]);
  const [employees] = useState<Employee[]>([]);

  useEffect(() => {
    onFilterChange(currentFilters);
  }, [currentFilters, onFilterChange]);

  useEffect(() => {
    const fetchData = async () => {
      if (filters.includes(FilterType.Organization)) {
        setOrganizations(await filterService.getOrganizations());
      }
      // Dependent fetches can be added here
    };
    fetchData();
  }, [filters]);

  const updateFilter = (key: string, value: unknown) => {
    setCurrentFilters(prev => ({ ...prev, [key]: value }));
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
                />
              </div>
            );
          case FilterType.Organization:
            return <SelectFilter key={filterType} label="Organisation" placeholder="Sélectionnez une organisation" options={organizations.map(o => ({ value: o.id, label: o.name }))} onChange={value => updateFilter("organization_ids", [value])} />;
          case FilterType.Site:
            return <SelectFilter key={filterType} label="Site" placeholder="Sélectionnez un site" options={sites.map(s => ({ value: s.id, label: s.name }))} onChange={value => updateFilter("site_ids", [value])} />;
          case FilterType.Department:
            return <SelectFilter key={filterType} label="Département" placeholder="Sélectionnez un département" options={departments.map(d => ({ value: d.id, label: d.name }))} onChange={value => updateFilter("department_ids", [value])} />;
          case FilterType.Employee:
            return <SelectFilter key={filterType} label="Employé" placeholder="Sélectionnez un employé" options={employees.map(e => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }))} onChange={value => updateFilter("employee_ids", [value])} />;
          case FilterType.LeaveType:
            return <SelectFilter key={filterType} label="Type de congé" placeholder="Sélectionnez un type" options={Object.values(LeaveType).map(lt => ({ value: lt, label: lt }))} onChange={value => updateFilter("leave_type", value)} />;
          case FilterType.LeaveStatus:
            return <SelectFilter key={filterType} label="Statut du congé" placeholder="Sélectionnez un statut" options={Object.values(LeaveStatus).map(ls => ({ value: ls, label: ls }))} onChange={value => updateFilter("status", value)} />;
          case FilterType.Year:
            return (
                <div key={filterType} className="space-y-2">
                    <Label>Année</Label>
                    <Input type="number" placeholder="Entrez une année" onChange={e => updateFilter("year", parseInt(e.target.value))} />
                </div>
            );
          case FilterType.Month:
            return (
                <div key={filterType} className="space-y-2">
                    <Label>Mois</Label>
                    <Input type="number" placeholder="Entrez un mois" onChange={e => updateFilter("month", parseInt(e.target.value))} />
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