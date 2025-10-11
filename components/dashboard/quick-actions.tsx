"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, UserPlus, FileText, Settings } from "lucide-react"

const actions = [
  {
    title: "Exporter rapport",
    description: "Télécharger les données",
    icon: FileDown,
    action: () => console.log("Export"),
  },
  {
    title: "Ajouter employé",
    description: "Nouvel enregistrement",
    icon: UserPlus,
    action: () => console.log("Add employee"),
  },
  {
    title: "Générer rapport",
    description: "Rapport personnalisé",
    icon: FileText,
    action: () => console.log("Generate report"),
  },
  {
    title: "Paramètres",
    description: "Configuration système",
    icon: Settings,
    action: () => console.log("Settings"),
  },
]

export function QuickActions() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Raccourcis fréquemment utilisés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3 bg-transparent"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
