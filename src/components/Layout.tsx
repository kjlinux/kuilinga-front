"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { Toaster } from "sonner"
import { TourProvider } from "@/contexts/TourContext"
import { TourGuide } from "@/components/tour"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <TourProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" richColors />
        <TourGuide />
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main
            className={`flex-1 p-4 md:p-6 lg:p-8 mt-16 transition-all duration-300 ${
              sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </TourProvider>
  )
}

export default Layout