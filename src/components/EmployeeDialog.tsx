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
import { Employee, EmployeeCreate, EmployeeUpdate, Organization, Site, Department } from "../types"
import { useEffect, useState } from "react"
import organizationService from "@/services/organization.service"
import siteService from "@/services/site.service"
import departmentService from "@/services/department.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface EmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: EmployeeCreate | EmployeeUpdate) => void
  employee: Employee | null
}

const EmployeeDialog = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
}: EmployeeDialogProps) => {
  const [formData, setFormData] = useState<Partial<EmployeeCreate | EmployeeUpdate>>({})
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    organizationService.getOrganizations({ limit: 1000 }).then(res => setOrganizations(res.items))
    siteService.getSites({ limit: 1000 }).then(res => setSites(res.items))
    departmentService.getDepartments({ limit: 1000 }).then(res => setDepartments(res.items))
  }, [])

  useEffect(() => {
    if (employee) {
      setFormData(employee)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [employee])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: "organization_id" | "site_id" | "department_id") => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.first_name) newErrors.first_name = "Le prénom est requis"
    if (!formData.last_name) newErrors.last_name = "Le nom est requis"
    if (!formData.email) newErrors.email = "L'email est requis"
    if (!formData.organization_id) newErrors.organization_id = "L'organisation est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as EmployeeCreate | EmployeeUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{employee ? "Modifier" : "Ajouter"} un employé</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" value={formData.first_name ?? ""} onChange={handleChange} />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" value={formData.last_name ?? ""} onChange={handleChange} />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={formData.phone ?? ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee_number">N° Employé</Label>
              <Input id="employee_number" value={formData.employee_number ?? ""} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input id="position" value={formData.position ?? ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge_id">N° Badge</Label>
              <Input id="badge_id" value={formData.badge_id ?? ""} onChange={handleChange} />
            </div>
          </div>
          {!employee && (
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
          <div className="space-y-2">
            <Label htmlFor="department_id">Département</Label>
            <Select onValueChange={handleSelectChange("department_id")} value={formData.department_id}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dep => (
                  <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
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
            {employee ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDialog