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
import { Permission, PermissionCreate, PermissionUpdate } from "../types"
import { useEffect, useState } from "react"

interface PermissionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: PermissionCreate | PermissionUpdate) => void
  permission: Permission | null
}

const PermissionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  permission,
}: PermissionDialogProps) => {
  const [formData, setFormData] = useState<Partial<PermissionCreate | PermissionUpdate>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (permission) {
      setFormData(permission)
    } else {
      setFormData({})
    }
    setErrors({})
  }, [permission])

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
      onConfirm(formData as PermissionCreate | PermissionUpdate)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{permission ? "Modifier" : "Ajouter"} une permission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name ?? ""} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description ?? ""} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {permission ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PermissionDialog
