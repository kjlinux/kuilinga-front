"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"

type Performer = {
  rank: number;
  name: string;
  attendanceRate: string;
  department: string;
};

interface TopPerformersTableProps {
  period: string
}

export function TopPerformersTable({ period }: TopPerformersTableProps) {
  const [data, setData] = useState<Performer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await api.getTopPerformers(period)
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [period])

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Top 5 - Meilleure assiduité</CardTitle>
        <CardDescription>Employés avec le meilleur taux de présence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rang</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Taux de présence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  </TableRow>
                ))
              ) : (
                data.map((performer) => (
                  <TableRow key={performer.rank}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{performer.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{performer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{performer.department}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-chart-3">{performer.attendanceRate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
