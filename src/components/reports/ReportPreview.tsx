import { ReportId } from "@/config/reports.config";
import { R1MultiOrgConsolidated as R1_MultiOrgConsolidated } from "./previews/R1_MultiOrgConsolidated";
import { R5OrgPresence } from "./previews/R5_OrgPresence";
import { R7AbsenceAnalysis } from "./previews/R7_AbsenceAnalysis";
import { R9EmployeeWorkedHours } from "./previews/R9_EmployeeWorkedHours";
import { R10SiteActivity } from "./previews/R10_SiteActivity";
import { R12DeptPresence } from "./previews/R12_DeptPresence";
import { R15LeaveRequests } from "./previews/R15_LeaveRequests";
import { R16TeamPerformance } from "./previews/R16_TeamPerformance";
import { R17MyPresence } from "./previews/R17_MyPresence";
import { R18MyMonthlySummary } from "./previews/R18_MyMonthlySummary";
import { R19MyLeaves } from "./previews/R19_MyLeaves";

interface ReportPreviewProps {
  reportId: ReportId;
  data: Record<string, unknown>;
}

export const ReportPreview = ({ reportId, data }: ReportPreviewProps) => {
  if (!data) {
    return <p className="text-center text-muted-foreground">Aucune donnée à prévisualiser.</p>;
  }

  switch (reportId) {
    case ReportId.R1_MultiOrgConsolidated:
      return <R1_MultiOrgConsolidated data={data} />;
    case ReportId.R5_OrgPresence:
      return <R5OrgPresence data={data} />;
    case ReportId.R7_AbsenceAnalysis:
      return <R7AbsenceAnalysis data={data} />;
    case ReportId.R9_EmployeeWorkedHours:
      return <R9EmployeeWorkedHours data={data} />;
    case ReportId.R10_SiteActivity:
      return <R10SiteActivity data={data} />;
    case ReportId.R12_DeptPresence:
      return <R12DeptPresence data={data} />;
    case ReportId.R15_LeaveRequests:
      return <R15LeaveRequests data={data} />;
    case ReportId.R16_TeamPerformance:
      return <R16TeamPerformance data={data} />;
    case ReportId.R17_MyPresence:
      return <R17MyPresence data={data} />;
    case ReportId.R18_MyMonthlySummary:
      return <R18MyMonthlySummary data={data} />;
    case ReportId.R19_MyLeaves:
      return <R19MyLeaves data={data} />;
    case ReportId.R6_MonthlySynthetic:
      return <R5OrgPresence data={data as OrganizationPresenceResponse} />;
    case ReportId.R13_TeamWeekly:
      return <R12DeptPresence data={data as DepartmentPresenceResponse} />;

    // Add other report previews here as they are created

    default:
      return (
        <div>
          <h3 className="text-lg font-semibold mb-2">Prévisualisation non implémentée</h3>
          <p className="text-sm text-muted-foreground mb-4">
            La prévisualisation pour le rapport "{reportId}" n'est pas encore disponible. Voici les données brutes :
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
};