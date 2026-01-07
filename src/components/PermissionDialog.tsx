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
import type { Permission, PermissionCreate, PermissionUpdate } from '@/api';
import { Textarea } from '@/components/ui/textarea';

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: PermissionCreate | PermissionUpdate) => void;
  permission: Permission | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  description: z.string().optional(),
});

const PermissionDialog = ({ isOpen, onClose, onConfirm, permission }: PermissionDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Reset form when permission changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: permission?.name || '',
        description: permission?.description || '',
      });
    }
  }, [permission, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{permission ? 'Modifier la permission' : 'Nouvelle permission'}</DialogTitle>
          <DialogDescription>
            {permission
              ? 'Modifiez les informations de la permission.'
              : 'Remplissez le formulaire pour créer une nouvelle permission.'}
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
                    <Input placeholder="ex: users:read" {...field} />
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
                    <Textarea
                      placeholder="ex: Permet de lire les informations des utilisateurs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {permission ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
