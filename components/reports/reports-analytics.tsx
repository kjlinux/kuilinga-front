"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, FileDown, FileSpreadsheet, FileText } from "lucide-react"
import { MonthlyAttendanceChart } from "./monthly-attendance-chart"
import { TopPerformersTable } from "./top-performers-table"
import { DepartmentComparisonChart } from "./department-comparison-chart"
import { simulateDownload } from "@/lib/utils"

export function ReportsAnalytics() {
  const [period, setPeriod] = useState("month")

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    const content = "col1,col2,col3\nval1,val2,val3";
    simulateDownload(content, `report.${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Rapports & Analyses</h1>
          <p className="text-muted-foreground mt-2">Analyses détaillées et exports de données</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("csv")}>
            <FileDown className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Période d&apos;analyse</CardTitle>
              <CardDescription>Sélectionnez la période pour générer les rapports</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd&apos;hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyAttendanceChart period={period} />
        <DepartmentComparisonChart period={period} />
      </div>

      <TopPerformersTable period={period} />
    </div>
  )
}
