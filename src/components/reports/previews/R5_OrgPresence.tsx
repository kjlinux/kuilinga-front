import { OrganizationPresenceResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface R5OrgPresenceProps {
  data: OrganizationPresenceResponse;
}

export const R5OrgPresence = ({ data }: R5OrgPresenceProps) => {
  const chartData = data.data.map(item => ({
    name: item.employee_name,
    présence: item.present_days,
    absence: item.absent_days,
    congé: item.on_leave_days,
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="présence" stackId="a" fill="#82ca9d" name="Jours présents" />
            <Bar dataKey="absence" stackId="a" fill="#ffc658" name="Jours absents" />
            <Bar dataKey="congé" stackId="a" fill="#8884d8" name="Jours en congé" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Jours présents</TableHead>
            <TableHead>Jours absents</TableHead>
            <TableHead>Jours en congé</TableHead>
            <TableHead>Heures travaillées</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row) => (
            <TableRow key={row.employee_id}>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.present_days}</TableCell>
              <TableCell>{row.absent_days}</TableCell>
              <TableCell>{row.on_leave_days}</TableCell>
              <TableCell>{row.total_hours_worked.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};