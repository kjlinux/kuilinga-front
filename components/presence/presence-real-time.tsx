"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download } from "lucide-react"

const attendanceData = [
  {
    id: 1,
    name: "Jean Dupont",
    matricule: "EMP001",
    department: "IT",
    arrivalTime: "08:15",
    departureTime: "-",
    status: "present",
  },
  {
    id: 2,
    name: "Marie Martin",
    matricule: "EMP002",
    department: "RH",
    arrivalTime: "08:45",
    departureTime: "-",
    status: "late",
  },
  {
    id: 3,
    name: "Pierre Dubois",
    matricule: "EMP003",
    department: "Finance",
    arrivalTime: "08:10",
    departureTime: "17:30",
    status: "present",
  },
  {
    id: 4,
    name: "Sophie Laurent",
    matricule: "EMP004",
    department: "Marketing",
    arrivalTime: "-",
    departureTime: "-",
    status: "absent",
  },
  {
    id: 5,
    name: "Luc Bernard",
    matricule: "EMP005",
    department: "IT",
    arrivalTime: "08:30",
    departureTime: "-",
    status: "present",
  },
]

const statusConfig = {
  present: { label: "Présent", variant: "default" as const },
  late: { label: "Retard", variant: "secondary" as const },
  absent: { label: "Absent", variant: "destructive" as const },
}

export function PresenceRealTime() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Présence en temps réel</h1>
        <p className="text-muted-foreground mt-2">Suivi en direct des présences, absences et retards</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Liste des présences</CardTitle>
          <CardDescription>Mise à jour automatique toutes les 30 secondes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Heure de départ</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell className="font-mono text-sm">{record.matricule}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>{record.arrivalTime}</TableCell>
                    <TableCell>{record.departureTime}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[record.status].variant}>{statusConfig[record.status].label}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
