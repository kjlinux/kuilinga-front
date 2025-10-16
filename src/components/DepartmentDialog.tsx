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
import { Department, DepartmentCreate, DepartmentUpdate, Site, Employee } from "../types"
import { useEffect, useState } from "react"
import siteService from "@/services/site.service"
import employeeService from "@/services/employee.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepartmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: DepartmentCreate | DepartmentUpdate) => void
  department: Department | null
}

const DepartmentDialog = ({
  isOpen,
  onClose,
  onConfirm,
  department,
}: DepartmentDialogProps) => {
  const [formData, setFormData] = useState<Partial<DepartmentCreate | DepartmentUpdate>>({})
  const [sites, setSites] = useState<Site[]>([])
  const [managers, setManagers] = useState<Employee[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    siteService.getSites({ limit: 1000 }).then(res => setSites(res.items))
    employeeService.getEmployees({ limit: 1000 }).then(res => setManagers(res.items))
  }, [])

  useEffect(() => {
    if (department) {
      setFormData(department)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [department])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: "site_id" | "manager_id") => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Le nom est requis"
    if (!formData.site_id) newErrors.site_id = "Le site est requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as DepartmentCreate | DepartmentUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{department ? "Modifier" : "Ajouter"} un département</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name ?? ""} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
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
            {errors.site_id && <p className="text-red-500 text-sm">{errors.site_id}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager_id">Manager</Label>
            <Select onValueChange={handleSelectChange("manager_id")} value={formData.manager_id}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name}</SelectItem>
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
            {department ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DepartmentDialog