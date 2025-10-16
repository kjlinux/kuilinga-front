import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Organization, OrganizationCreate, OrganizationUpdate } from "../types"
import { useEffect, useState } from "react"

interface OrganizationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: OrganizationCreate | OrganizationUpdate) => void
  organization: Organization | null
}

const OrganizationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  organization,
}: OrganizationDialogProps) => {
  const [formData, setFormData] = useState<Partial<OrganizationCreate | OrganizationUpdate>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (organization) {
      setFormData(organization)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [organization])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Le nom est requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as OrganizationCreate | OrganizationUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{organization ? "Modifier" : "Ajouter"} une organisation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name ?? ""} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={formData.phone ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Input id="timezone" value={formData.timezone ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Input id="plan" value={formData.plan ?? ""} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {organization ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationDialog