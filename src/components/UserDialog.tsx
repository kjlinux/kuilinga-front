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
import { User, UserCreate, UserUpdate, Role } from '@/types';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import userService from '@/services/user.service';
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
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const formSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role_id: z.string(),
  is_active: z.boolean(),
});

const UserDialog = ({ open, onClose, user }: UserDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      password: '',
      role_id: user?.roles[0]?.id || '',
      is_active: user?.is_active || true,
    },
  });

  const { data: roles } = useQuery('roles', () => roleService.getRoles());

  const createUserMutation = useMutation(
    (data: UserCreate) => userService.createUser(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        onClose();
      },
    }
  );

  const updateUserMutation = useMutation(
    (data: UserUpdate) => userService.updateUser(user!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        onClose();
      },
    }
  );

  const assignRoleMutation = useMutation(
    ({ userId, roleId }: { userId: string; roleId: string }) =>
      userService.assignRoleToUser(userId, roleId)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (user) {
      updateUserMutation.mutate(values);
    } else {
      const newUser = await createUserMutation.mutateAsync(values);
      if (newUser && values.role_id) {
        assignRoleMutation.mutate({ userId: newUser.id, roleId: values.role_id });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Update the user details.'
              : 'Fill in the form to create a new user.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!user && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.items.map((role: Role) => (
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
            {user && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
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
            )}
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
