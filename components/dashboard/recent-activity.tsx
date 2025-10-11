"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api/index"

type Activity = {
  id: number
  employee: string
  action: string
  time: string
  status: "present" | "late" | "absent"
  department: string
}

const statusConfig = {
  present: {
    label: "Présent",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  late: {
    label: "Retard",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  absent: {
    label: "Absent",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      const data = await api.getRecentActivities()
      setActivities(data)
      setLoading(false)
    }
    fetchActivities()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
        <CardDescription>Derniers pointages et événements enregistrés.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead className="hidden sm:table-cell">Statut</TableHead>
                <TableHead className="hidden md:table-cell">Département</TableHead>
                <TableHead className="text-right">Heure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="font-medium">{activity.employee}</div>
                    <div className="text-xs text-muted-foreground hidden sm:inline">
                      {activity.action}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={statusConfig[activity.status].variant}
                      className={statusConfig[activity.status].className}
                    >
                      {statusConfig[activity.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {activity.department}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {activity.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/activity">
            Voir tout <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
