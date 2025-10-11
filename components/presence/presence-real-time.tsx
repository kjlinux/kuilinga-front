"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Download } from "lucide-react"
import { api } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"

type AttendanceRecord = {
  id: number;
  name: string;
  matricule: string;
  department: string;
  arrivalTime: string;
  departureTime: string;
  status: "present" | "late" | "absent";
};

const statusConfig = {
  present: { label: "Présent", variant: "default" as const },
  late: { label: "Retard", variant: "secondary" as const },
  absent: { label: "Absent", variant: "destructive" as const },
};

export function PresenceRealTime() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await api.getAttendanceData(debouncedSearchTerm, departmentFilter);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [debouncedSearchTerm, departmentFilter]);

    useEffect(() => {
    const interval = setInterval(() => {
      api.getAttendanceData(debouncedSearchTerm, departmentFilter).then(setData);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [debouncedSearchTerm, departmentFilter]);

  const handleExport = () => {
    // In a real app, this would trigger a download
    console.log("Exporting data...", { searchTerm, departmentFilter });
    alert("Fonctionnalité d'exportation non implémentée.");
  };

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
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
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
                  <TableHead>Heure d&apos;arrivée</TableHead>
                  <TableHead>Heure de départ</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  data.map((record) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
