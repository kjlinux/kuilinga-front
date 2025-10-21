import { useState } from 'react';
import { useQuery } from 'react-query';
import userService from '../services/user.service';
import { User } from '../types';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import UserDialog from '@/components/UserDialog';
import { ColumnDef } from '@tanstack/react-table';

const Users = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery(['users'], () => userService.getUsers());

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: 'Full Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles;
        return <span>{roles.map(role => role.name).join(', ')}</span>;
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                    }}
                >
                    Edit
                </Button>
            );
        },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Add User
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={users?.items || []}
        isLoading={isLoading}
        error={null}
        onRetry={() => {}}
        pagination={{
          pageIndex: users?.skip ? users.skip / (users.limit || 1) : 0,
          pageSize: users?.limit || 10,
          pageCount: users?.total ? Math.ceil(users.total / (users.limit || 1)) : 1,
        }}
        onPageChange={() => {}}
      />
      <UserDialog
        open={dialogOpen}
        onClose={() => {
            setDialogOpen(false);
            setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
