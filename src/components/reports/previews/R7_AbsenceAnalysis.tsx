import { DepartmentLeavesResponse } from "@/types"; // Re-using this type as the structure is identical
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface R7AbsenceAnalysisProps {
  data: DepartmentLeavesResponse;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export const R7AbsenceAnalysis = ({ data }: R7AbsenceAnalysisProps) => {
  const leaveTypeCounts = data.data.reduce((acc, row) => {
    acc[row.leave_type] = (acc[row.leave_type] || 0) + row.total_days;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(leaveTypeCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Département/Organisation:</strong> {data.department_name}</div>
        <div><strong>Période:</strong> {data.period}</div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Du</TableHead>
            <TableHead>Au</TableHead>
            <TableHead>Jours</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Raison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.leave_type}</TableCell>
              <TableCell>{row.start_date}</TableCell>
              <TableCell>{row.end_date}</TableCell>
              <TableCell>{row.total_days}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};