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
import type { Role, RoleCreate, RoleUpdate, Permission } from '@/api';
import { useQuery } from '@tanstack/react-query';
import permissionService from '@/services/permission.service';
import { Checkbox } from "@/components/ui/checkbox";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RoleCreate | RoleUpdate) => void;
  role: Role | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Le nom du rôle doit contenir au moins 2 caractères.'),
  description: z.string().optional(),
  permission_ids: z.array(z.string()).optional(),
});

const RoleDialog = ({ isOpen, onClose, onConfirm, role }: RoleDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      permission_ids: [],
    },
  });

  const { data: permissionsResponse } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getPermissions(),
  });

  // Reset form when role changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: role?.name || '',
        description: role?.description || '',
        permission_ids: role?.permissions?.map(p => p.id) || [],
      });
    }
  }, [role, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm(values);
  };

  const permissions = permissionsResponse?.items || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? 'Modifier le rôle' : 'Nouveau rôle'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Modifiez les informations du rôle et ses permissions.'
              : 'Remplissez le formulaire pour créer un nouveau rôle.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Administrateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Peut gérer tous les utilisateurs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permission_ids"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base">Permissions</FormLabel>
                  </div>
                  <div className="h-48 overflow-y-auto rounded-md border p-4">
                    <div className="space-y-3">
                      {permissions.map((permission: Permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permission_ids"
                          render={({ field }) => (
                            <FormItem
                              key={permission.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), permission.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  {permission.name}
                                </FormLabel>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                      {permissions.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucune permission disponible
                        </p>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {role ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
