import { TeamPerformanceResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface R16TeamPerformanceProps {
  data: TeamPerformanceResponse;
}

export const R16TeamPerformance = ({ data }: R16TeamPerformanceProps) => {
  const chartData = data.data.map(item => ({
    subject: item.employee_name,
    A: item.attendance_rate,
    B: item.total_hours_worked,
    fullMark: 100, // Assuming 100% is the max for attendance rate
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Département:</strong> {data.department_name}</div>
        <div><strong>Période:</strong> {data.period}</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            <Radar name="Taux de présence (%)" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Taux de présence</TableHead>
            <TableHead>Heures travaillées</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row) => (
            <TableRow key={row.employee_id}>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.attendance_rate.toFixed(2)}%</TableCell>
              <TableCell>{row.total_hours_worked.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};