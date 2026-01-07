import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User, UserCreate, UserUpdate, Role } from '@/api';
import { useQuery } from '@tanstack/react-query';
import roleService from '@/services/role.service';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: UserCreate | UserUpdate) => void;
  user: User | null;
}

const formSchema = z.object({
  full_name: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères.'),
  email: z.string().email('Adresse email invalide.'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.').optional().or(z.literal('')),
  role_id: z.string().optional(),
  is_active: z.boolean(),
});

const UserDialog = ({ isOpen, onClose, onConfirm, user }: UserDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role_id: '',
      is_active: true,
    },
  });

  const { data: rolesResponse } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
  });

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        full_name: user?.full_name || '',
        email: user?.email || '',
        password: '',
        role_id: user?.roles?.[0]?.id || '',
        is_active: user?.is_active ?? true,
      });
    }
  }, [user, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { role_id, ...userData } = values;

    if (user) {
      // Mode édition : ne pas envoyer le mot de passe s'il est vide
      const updateData: UserUpdate = {
        full_name: userData.full_name,
        email: userData.email,
        is_active: userData.is_active,
      };
      if (userData.password) {
        updateData.password = userData.password;
      }
      onConfirm(updateData);
    } else {
      // Mode création : le mot de passe est requis
      if (!userData.password) {
        form.setError('password', { message: 'Le mot de passe est requis pour créer un utilisateur.' });
        return;
      }
      const createData: UserCreate = {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
      };
      onConfirm(createData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Modifiez les informations de l\'utilisateur.'
              : 'Remplissez le formulaire pour créer un nouvel utilisateur.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jean.dupont@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mot de passe {user && <span className="text-muted-foreground text-sm">(laisser vide pour ne pas modifier)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={user ? '••••••••' : 'Mot de passe'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rolesResponse?.items?.map((role: Role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Statut actif</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {user ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
