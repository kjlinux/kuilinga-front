import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PresenceRealTime } from "@/components/presence/presence-real-time"

export default function PresencePage() {
  return (
    <DashboardLayout>
      <PresenceRealTime />
    </DashboardLayout>
  )
}
