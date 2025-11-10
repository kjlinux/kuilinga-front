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
import { Checkbox } from "@/components/ui/checkbox"
import type { Role, RoleCreate, RoleUpdate, Permission } from "../types"
import { useEffect, useState } from "react"
import permissionService from "@/services/permission.service"

interface RoleDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: RoleCreate | RoleUpdate) => void
  role: Role | null
}

const RoleDialog = ({
  isOpen,
  onClose,
  onConfirm,
  role,
}: RoleDialogProps) => {
  const [formData, setFormData] = useState<Partial<RoleCreate | RoleUpdate>>({})
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    permissionService.getPermissions({ limit: 1000 }).then(res => setPermissions(res.items))
  }, [])

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
      })
      setSelectedPermissions(role.permissions?.map(p => p.id) || [])
    } else {
      setFormData({})
      setSelectedPermissions([])
    }
    setErrors({})
  }, [role])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Le nom est requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      const dataToSubmit = {
        ...formData,
        permission_ids: selectedPermissions,
      } as RoleCreate | RoleUpdate
      onConfirm(dataToSubmit)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? "Modifier" : "Ajouter"} un rôle</DialogTitle>
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
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {permission.name}
                    {permission.description && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({permission.description})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {role ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RoleDialog
