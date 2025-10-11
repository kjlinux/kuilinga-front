// app/profile/page.tsx
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserProfile } from "@/components/profile/user-profile";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <UserProfile />
    </DashboardLayout>
  );
}
