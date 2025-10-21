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
import { Role, RoleCreate, RoleUpdate, Permission } from '@/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import roleService from '@/services/role.service';
import permissionService from '@/services/permission.service';
import { Checkbox } from "@/components/ui/checkbox"


interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters.'),
  description: z.string().optional(),
  permission_ids: z.array(z.string()).optional(),
});

const RoleDialog = ({ open, onClose, role }: RoleDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permission_ids: role?.permissions.map(p => p.id) || [],
    },
  });

  const { data: permissions } = useQuery('permissions', () =>
    permissionService.getPermissions()
  );

  const createRoleMutation = useMutation(
    (data: RoleCreate) => roleService.createRole(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        onClose();
      },
    }
  );

  const updateRoleMutation = useMutation(
    (data: RoleUpdate) => roleService.updateRole(role!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        onClose();
      },
    }
  );

  const assignPermissionMutation = useMutation(
    ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      roleService.assignPermissionToRole(roleId, permissionId)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { permission_ids, ...roleData } = values;
    if (role) {
      updateRoleMutation.mutate(roleData);
    } else {
      const newRole = await createRoleMutation.mutateAsync(roleData);
      if (newRole && permission_ids) {
        permission_ids.forEach(permissionId => {
          assignPermissionMutation.mutate({ roleId: newRole.id, permissionId });
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Add Role'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Update the role details.'
              : 'Fill in the form to create a new role.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Administrator" {...field} />
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
                    <Input placeholder="e.g. Can manage all users" {...field} />
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
                  <div className="mb-4">
                    <FormLabel className="text-base">Permissions</FormLabel>
                  </div>
                  {permissions?.items.map((permission: Permission) => (
                    <FormField
                      key={permission.id}
                      control={form.control}
                      name="permission_ids"
                      render={({ field }) => {
                        return (
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
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {permission.name}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {role ? 'Update Role' : 'Create Role'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
