import { WorkedHoursResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface R9EmployeeWorkedHoursProps {
  data: WorkedHoursResponse;
}

export const R9EmployeeWorkedHours = ({ data }: R9EmployeeWorkedHoursProps) => {
  // Aggregate hours per day for the chart
  const dailyHours = data.data.reduce((acc, row) => {
    const date = row.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += row.total_hours;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dailyHours).map(([date, hours]) => ({ date, hours }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Organisation:</strong> {data.organization_name}</div>
        <div><strong>Période:</strong> {data.period}</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hours" stroke="#8884d8" name="Heures totales par jour" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Arrivée</TableHead>
            <TableHead>Départ</TableHead>
            <TableHead>Heures totales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.department_name ?? 'N/A'}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.check_in ?? 'N/A'}</TableCell>
              <TableCell>{row.check_out ?? 'N/A'}</TableCell>
              <TableCell>{row.total_hours.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};