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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserCreate, UserUpdate, Role } from "../types"
import { useEffect, useState } from "react"
import roleService from "@/services/role.service"

interface UserDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: UserCreate | UserUpdate, roleId: string) => void
  user: User | null
}

const UserDialog = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}: UserDialogProps) => {
  const [formData, setFormData] = useState<Partial<UserCreate | UserUpdate>>({})
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    roleService.getRoles({ limit: 1000 }).then(res => setRoles(res.items))
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        is_active: user.is_active,
        organization_id: user.organization_id,
      })
      // Set the first role as selected (users can have multiple roles, but we'll manage the primary one)
      setSelectedRoleId(user.roles && user.roles.length > 0 ? user.roles[0].id : '')
    } else {
      setFormData({ is_active: true })
      setSelectedRoleId('')
    }
    setErrors({})
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.full_name) newErrors.full_name = "Le nom complet est requis"
    if (!formData.email) newErrors.email = "L'email est requis"
    if (!user && !formData.password) newErrors.password = "Le mot de passe est requis"
    if (!user && formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }
    if (!selectedRoleId) newErrors.role = "Le rôle est requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(formData as UserCreate | UserUpdate, selectedRoleId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Modifier" : "Ajouter"} un utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input id="full_name" value={formData.full_name ?? ""} onChange={handleChange} />
            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={formData.password ?? ""} onChange={handleChange} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="phone_number">Téléphone</Label>
            <Input id="phone_number" value={formData.phone_number ?? ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          {user && (
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="is_active">Statut actif</Label>
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {user ? "Enregistrer" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog
