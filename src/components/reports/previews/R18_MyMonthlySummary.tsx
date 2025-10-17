import { EmployeeMonthlySummaryResponse } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface R18MyMonthlySummaryProps {
  data: EmployeeMonthlySummaryResponse;
}

export const R18MyMonthlySummary = ({ data }: R18MyMonthlySummaryProps) => {
  const chartData = data.daily_data.map((d: { date: string; total_hours?: number }) => ({
    date: d.date,
    heures: d.total_hours || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Employé:</strong> {data.employee_name}</div>
        <div><strong>Matricule:</strong> {data.employee_badge_id}</div>
        <div><strong>Département:</strong> {data.department_name ?? 'N/A'}</div>
        <div><strong>Période:</strong> {data.period}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(data.summary).map(([key, value]) => (
          <div key={key} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-muted-foreground">{key.replace(/_/g, ' ')}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="heures" fill="#82ca9d" name="Heures travaillées" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};