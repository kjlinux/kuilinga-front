"use client"

import AdminDashboard from "../components/dashboards/AdminDashboard"
import ManagerDashboard from "../components/dashboards/ManagerDashboard"
import EmployeeDashboard from "../components/dashboards/EmployeeDashboard"
import IntegratorDashboard from "../components/dashboards/IntegratorDashboard"
import { Separator } from "@/components/ui/separator"

const DashboardPage = () => {
  // For now, we display all dashboards.
  // Later, this will be controlled by user roles and permissions.
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Tableaux de Bord Complets
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de toutes les perspectives et KPIs.
        </p>
      </div>

      <Separator />

      <section id="admin-dashboard">
        <AdminDashboard />
      </section>

      <Separator className="my-8" />

      <section id="manager-dashboard">
        <ManagerDashboard />
      </section>

      <Separator className="my-8" />

      <section id="employee-dashboard">
        <EmployeeDashboard />
      </section>

      <Separator className="my-8" />

      <section id="integrator-dashboard">
        <IntegratorDashboard />
      </section>
    </div>
  )
}

export default DashboardPage