"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    employee: "Jean Dupont",
    action: "Pointage d'entrée",
    time: "08:15",
    status: "present",
    department: "IT",
  },
  {
    id: 2,
    employee: "Marie Martin",
    action: "Pointage d'entrée",
    time: "08:45",
    status: "late",
    department: "RH",
  },
  {
    id: 3,
    employee: "Pierre Dubois",
    action: "Pointage de sortie",
    time: "17:30",
    status: "present",
    department: "Finance",
  },
  {
    id: 4,
    employee: "Sophie Laurent",
    action: "Absence justifiée",
    time: "09:00",
    status: "absent",
    department: "Marketing",
  },
  {
    id: 5,
    employee: "Luc Bernard",
    action: "Pointage d'entrée",
    time: "08:30",
    status: "present",
    department: "IT",
  },
]

const statusConfig = {
  present: { label: "Présent", variant: "default" as const },
  late: { label: "Retard", variant: "secondary" as const },
  absent: { label: "Absent", variant: "destructive" as const },
}

export function RecentActivity() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Derniers pointages et événements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {activity.employee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.employee}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {activity.department}
                </Badge>
                <Badge variant={statusConfig[activity.status].variant}>{statusConfig[activity.status].label}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
