import { EmployeePresenceReportResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface R17MyPresenceProps {
  data: EmployeePresenceReportResponse;
}

export const R17MyPresence = ({ data }: R17MyPresenceProps) => {
  const chartData = data.data.map(item => ({
    date: item.date,
    heures: item.total_hours || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Employé:</strong> {data.employee_name}</div>
        <div><strong>Matricule:</strong> {data.employee_badge_id}</div>
        <div><strong>Département:</strong> {data.department_name ?? "N/A"}</div>
        <div><strong>Période:</strong> {data.start_date} au {data.end_date}</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="heures" stroke="#8884d8" name="Heures travaillées" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Heure d'arrivée</TableHead>
            <TableHead>Heure de départ</TableHead>
            <TableHead>Heures totales</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.check_in ?? "N/A"}</TableCell>
              <TableCell>{row.check_out ?? "N/A"}</TableCell>
              <TableCell>{row.total_hours?.toFixed(2) ?? "N/A"}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};