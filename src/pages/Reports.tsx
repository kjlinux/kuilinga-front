"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REPORTS_CONFIG, ReportId } from "@/config/reports.config";
import { useAuth } from "@/hooks/useAuth";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportPreview } from "@/components/reports/ReportPreview";
import reportService from "@/services/report.service";
import { toast } from "sonner";

const ReportsPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<ReportId | null>(null);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [previewData, setPreviewData] = useState<Record<string, unknown> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const availableReports = useMemo(() => {
    if (!user?.roles) {
      return [];
    }
    const userRoleNames = user.roles.map(r => r.name);
    return REPORTS_CONFIG.filter(report =>
      report.roles.some(role => userRoleNames.includes(role))
    );
  }, [user]);

  const selectedReport = useMemo(() => {
    return REPORTS_CONFIG.find(r => r.id === selectedReportId) ?? null;
  }, [selectedReportId]);

  const handleGeneratePreview = async () => {
    if (!selectedReport) return;

    setIsGenerating(true);
    setPreviewData(null);
    try {
      const data = await reportService.generateReportPreview(selectedReport.previewEndpoint, filters);
      setPreviewData(data);
      toast.success("La prévisualisation du rapport a été générée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la génération de la prévisualisation:", error);
      toast.error("Échec de la génération de la prévisualisation du rapport.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (format: "pdf" | "csv" | "excel") => {
    if (!selectedReport) return;

    setIsDownloading(true);
    try {
      const downloadFilters = { ...filters, format };
      await reportService.downloadReport(selectedReport.downloadEndpoint, downloadFilters);
      toast.success(`Le rapport a été téléchargé en format ${format.toUpperCase()}.`);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du rapport en ${format}:`, error);
      toast.error(`Échec du téléchargement du rapport en ${format.toUpperCase()}.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Rapports et Analyses</h1>
        <p className="text-accent">Visualisez et exportez vos rapports de présence.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélection du Rapport</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isAuthLoading ? (
            <div className="flex items-center space-x-2 text-accent">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Chargement des rapports...</span>
            </div>
          ) : (
            <Select
              onValueChange={(value: ReportId) => {
                setSelectedReportId(value);
                setFilters({});
                setPreviewData(null);
              }}
              disabled={availableReports.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={availableReports.length > 0 ? "Choisissez un rapport..." : "Aucun rapport disponible"} />
              </SelectTrigger>
              <SelectContent>
                {availableReports.map(report => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>{selectedReport.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ReportFilters
                filters={selectedReport.filters}
                onFilterChange={setFilters}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleGeneratePreview} disabled={isGenerating} className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  {isGenerating ? "Génération en cours..." : "Générer la prévisualisation"}
                </Button>
                <Select onValueChange={(value: "pdf" | "csv" | "excel") => handleDownloadReport(value)} disabled={isDownloading}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Télécharger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isGenerating && <p>Chargement de la prévisualisation...</p>}

          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation du Rapport</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportPreview reportId={selectedReport.id} data={previewData} />
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ReportsPage;