"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api/index";

type ChartData = {
  day: number;
  attendance: number;
};

interface MonthlyAttendanceChartProps {
  period: string;
}

export function MonthlyAttendanceChart({
  period,
}: MonthlyAttendanceChartProps) {
  const [chartData, setChartData] = useState<{
    month: string;
    data: ChartData[];
  }>({ month: "", data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await api.getMonthlyAttendance(period);
      setChartData(data);
      setLoading(false);
    };
    fetchData();
  }, [period]);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Présence pour : {chartData.month}</CardTitle>
        <CardDescription>Taux de présence journalier</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer
            config={{
              attendance: {
                label: "Présence",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="attendance"
                  fill="var(--color-attendance)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
