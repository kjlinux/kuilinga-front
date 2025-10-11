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

type ComparisonData = {
  department: string;
  attendance: number;
  delays: number;
  absences: number;
};

interface DepartmentComparisonChartProps {
  period: string;
}

export function DepartmentComparisonChart({
  period,
}: DepartmentComparisonChartProps) {
  const [data, setData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await api.getDepartmentComparison(period);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [period]);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Comparaison par département</CardTitle>
        <CardDescription>Données aggrégées par département</CardDescription>
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
              delays: {
                label: "Retards",
                color: "hsl(var(--chart-2))",
              },
              absences: {
                label: "Absences",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="department"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="attendance"
                  stackId="a"
                  fill="var(--color-attendance)"
                  radius={[4, 0, 0, 4]}
                />
                <Bar dataKey="delays" stackId="a" fill="var(--color-delays)" />
                <Bar
                  dataKey="absences"
                  stackId="a"
                  fill="var(--color-absences)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
