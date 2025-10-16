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
import { Site, SiteCreate, SiteUpdate, Organization } from "../types"
import { useEffect, useState } from "react"
import organizationService from "@/services/organization.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface SiteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: SiteCreate | SiteUpdate) => void
  site: Site | null
}

const SiteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  site,
}: SiteDialogProps) => {
  const [formData, setFormData] = useState<Partial<SiteCreate | SiteUpdate>>({})
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    organizationService.getOrganizations({ limit: 1000 }).then(res => setOrganizations(res.items))
  }, [])

  useEffect(() => {
    if (site) {
      setFormData(site)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [site])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: "organization_id") => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Le nom est requis"
    if (!formData.organization_id) newErrors.organization_id = "L'organisation est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as SiteCreate | SiteUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{site ? "Modifier" : "Ajouter"} un site</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name ?? ""} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" value={formData.address ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Input id="timezone" value={formData.timezone ?? ""} onChange={handleChange} />
          </div>
          {!site && (
            <div className="space-y-2">
              <Label htmlFor="organization_id">Organisation</Label>
              <Select onValueChange={handleSelectChange("organization_id")} value={formData.organization_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organization_id && <p className="text-red-500 text-sm">{errors.organization_id}</p>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {site ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SiteDialog