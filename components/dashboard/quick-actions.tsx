"use client"

import { Button } from "@/components/ui/button"
import { FileDown, UserPlus, FileText } from "lucide-react"

const actions = [
  {
    title: "Exporter",
    icon: FileDown,
    action: () => console.log("Export"),
    variant: "outline" as const,
  },
  {
    title: "Générer Rapport",
    icon: FileText,
    action: () => console.log("Generate report"),
    variant: "outline" as const,
  },
  {
    title: "Ajouter Employé",
    icon: UserPlus,
    action: () => console.log("Add employee"),
    variant: "default" as const,
  },
]

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <Button
          key={action.title}
          variant={action.variant}
          size="sm"
          className="h-8"
          onClick={action.action}
        >
          <action.icon className="h-4 w-4 mr-2" />
          {action.title}
        </Button>
      ))}
    </div>
  )
}
