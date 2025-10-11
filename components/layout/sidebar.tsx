"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart3, X, Clock, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Présence en temps réel", href: "/presence", icon: Clock },
  { name: "Rapports & Analyses", href: "/reports", icon: BarChart3 },
  { name: "Profil", href: "/profile", icon: UserCircle },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 md:hidden border-b border-border">
          <span className="font-semibold text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-16 items-center justify-center border-b border-border">
          <Link href="/" className="font-bold text-xl">
            KUILINGA
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={onClose}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive && "bg-secondary text-secondary-foreground")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
