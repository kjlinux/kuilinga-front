"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"

const topPerformers = [
  { rank: 1, name: "Jean Dupont", department: "IT", rate: 100, trend: "up" },
  { rank: 2, name: "Marie Martin", department: "RH", rate: 99.5, trend: "up" },
  { rank: 3, name: "Pierre Dubois", department: "Finance", rate: 99.2, trend: "stable" },
  { rank: 4, name: "Sophie Laurent", department: "Marketing", rate: 98.8, trend: "up" },
  { rank: 5, name: "Luc Bernard", department: "IT", rate: 98.5, trend: "down" },
]

export function TopPerformersTable() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Top 5 - Meilleure assiduité</CardTitle>
        <CardDescription>Employés avec le meilleur taux de présence ce mois</CardDescription>
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
                <TableHead>Tendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((performer) => (
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
                  <TableCell className="font-semibold text-chart-3">{performer.rate}%</TableCell>
                  <TableCell>
                    {performer.trend === "up" && <TrendingUp className="h-4 w-4 text-chart-3" />}
                    {performer.trend === "down" && <TrendingDown className="h-4 w-4 text-chart-5" />}
                    {performer.trend === "stable" && <span className="text-muted-foreground text-sm">Stable</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
