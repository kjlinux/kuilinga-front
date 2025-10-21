import { useState } from 'react';
import { useQuery } from 'react-query';
import roleService from '../services/role.service';
import { Role } from '../types';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import RoleDialog from '@/components/RoleDialog';
import { ColumnDef } from '@tanstack/react-table';

const Roles = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data: roles, isLoading } = useQuery(['roles'], () => roleService.getRoles());

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permissions = row.original.permissions;
        return <span>{permissions.map(p => p.name).join(', ')}</span>;
      },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const role = row.original;
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setSelectedRole(role);
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
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Add Role
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={roles?.items || []}
        isLoading={isLoading}
        error={null}
        onRetry={() => {}}
        pagination={{
          pageIndex: roles?.skip ? roles.skip / (roles.limit || 1) : 0,
          pageSize: roles?.limit || 10,
          pageCount: roles?.total ? Math.ceil(roles.total / (roles.limit || 1)) : 1,
        }}
        onPageChange={() => {}}
      />
      <RoleDialog
        open={dialogOpen}
        onClose={() => {
            setDialogOpen(false);
            setSelectedRole(null);
        }}
        role={selectedRole}
      />
    </div>
  );
};

export default Roles;
