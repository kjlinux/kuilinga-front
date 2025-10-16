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
import { Leave, LeaveCreate, LeaveUpdate, Employee, LeaveType, LeaveStatus } from "../types"
import { useEffect, useState } from "react"
import employeeService from "@/services/employee.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"

interface LeaveDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: LeaveCreate | LeaveUpdate) => void
  leave: Leave | null
}

const LeaveDialog = ({
  isOpen,
  onClose,
  onConfirm,
  leave,
}: LeaveDialogProps) => {
  const [formData, setFormData] = useState<Partial<LeaveCreate | LeaveUpdate>>({})
  const [employees, setEmployees] = useState<Employee[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    employeeService.getEmployees({ limit: 1000 }).then(res => setEmployees(res.items))
  }, [])

  useEffect(() => {
    if (leave) {
      setFormData(leave)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [leave])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: "employee_id" | "leave_type" | "status") => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.employee_id) newErrors.employee_id = "L'employé est requis"
    if (!formData.leave_type) newErrors.leave_type = "Le type est requis"
    if (!formData.start_date) newErrors.start_date = "La date de début est requise"
    if (!formData.end_date) newErrors.end_date = "La date de fin est requise"
    if (!formData.reason) newErrors.reason = "La raison est requise"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as LeaveCreate | LeaveUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{leave ? "Modifier" : "Ajouter"} une demande de congé</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!leave && (
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employé</Label>
              <Select onValueChange={handleSelectChange("employee_id")} value={formData.employee_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee_id && <p className="text-red-500 text-sm">{errors.employee_id}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="leave_type">Type</Label>
            <Select onValueChange={handleSelectChange("leave_type")} value={formData.leave_type}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LeaveType).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leave_type && <p className="text-red-500 text-sm">{errors.leave_type}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date début</Label>
              <Input id="start_date" type="date" value={formData.start_date ?? ""} onChange={handleChange} />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date fin</Label>
              <Input id="end_date" type="date" value={formData.end_date ?? ""} onChange={handleChange} />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Raison</Label>
            <Textarea id="reason" value={formData.reason ?? ""} onChange={handleChange} />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
          </div>
          {leave && (
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select onValueChange={handleSelectChange("status")} value={formData.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LeaveStatus).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes ?? ""} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {leave ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveDialog