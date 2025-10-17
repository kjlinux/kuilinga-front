import { SiteActivityResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface R10SiteActivityProps {
  data: SiteActivityResponse;
}

export const R10SiteActivity = ({ data }: R10SiteActivityProps) => {
  const chartData = data.data.map(item => ({
    name: item.site_name,
    présents: item.present_employees,
    en_congé: item.on_leave_employees,
    heures_moyennes: item.average_hours_per_employee,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Organisation:</strong> {data.organization_name}</div>
        <div><strong>Période:</strong> {data.period}</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="présents" fill="#8884d8" name="Employés présents" />
            <Bar yAxisId="left" dataKey="en_congé" fill="#ffc658" name="Employés en congé" />
            <Bar yAxisId="right" dataKey="heures_moyennes" fill="#82ca9d" name="Heures moyennes / employé" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site</TableHead>
            <TableHead>Employés totaux</TableHead>
            <TableHead>Employés présents</TableHead>
            <TableHead>Employés en congé</TableHead>
            <TableHead>Heures travaillées</TableHead>
            <TableHead>Heures moyennes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.site_name}</TableCell>
              <TableCell>{row.total_employees}</TableCell>
              <TableCell>{row.present_employees}</TableCell>
              <TableCell>{row.on_leave_employees}</TableCell>
              <TableCell>{row.total_hours_worked.toFixed(2)}</TableCell>
              <TableCell>{row.average_hours_per_employee.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};