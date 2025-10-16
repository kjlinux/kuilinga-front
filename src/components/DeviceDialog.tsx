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
import { Device, DeviceCreate, DeviceUpdate, Site, Organization } from "../types"
import { useEffect, useState } from "react"
import siteService from "@/services/site.service"
import organizationService from "@/services/organization.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeviceDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: DeviceCreate | DeviceUpdate) => void
  device: Device | null
}

const DeviceDialog = ({
  isOpen,
  onClose,
  onConfirm,
  device,
}: DeviceDialogProps) => {
  const [formData, setFormData] = useState<Partial<DeviceCreate | DeviceUpdate>>({})
  const [sites, setSites] = useState<Site[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    siteService.getSites({ limit: 1000 }).then(res => setSites(res.items))
    organizationService.getOrganizations({ limit: 1000 }).then(res => setOrganizations(res.items))
  }, [])

  useEffect(() => {
    if (device) {
      setFormData(device)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [device])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: "site_id" | "organization_id") => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.serial_number) newErrors.serial_number = "Le numéro de série est requis"
    if (!formData.organization_id) newErrors.organization_id = "L'organisation est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as DeviceCreate | DeviceUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{device ? "Modifier" : "Ajouter"} un terminal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serial_number">N° Série</Label>
            <Input id="serial_number" value={formData.serial_number ?? ""} onChange={handleChange} />
            {errors.serial_number && <p className="text-red-500 text-sm">{errors.serial_number}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={formData.type ?? ""} onChange={handleChange} />
          </div>
          {!device && (
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
          <div className="space-y-2">
            <Label htmlFor="site_id">Site</Label>
            <Select onValueChange={handleSelectChange("site_id")} value={formData.site_id}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map(site => (
                  <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {device ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeviceDialog