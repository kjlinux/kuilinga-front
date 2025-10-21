import { useQuery } from 'react-query';
import permissionService from '../services/permission.service';
import { Permission } from '../types';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

const Permissions = () => {
  const { data: permissions, isLoading } = useQuery(['permissions'], () => permissionService.getPermissions());

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permissions</h1>
      </div>
      <DataTable
        columns={columns}
        data={permissions?.items || []}
        isLoading={isLoading}
        error={null}
        onRetry={() => {}}
        pagination={{
          pageIndex: permissions?.skip ? permissions.skip / (permissions.limit || 1) : 0,
          pageSize: permissions?.limit || 10,
          pageCount: permissions?.total ? Math.ceil(permissions.total / (permissions.limit || 1)) : 1,
        }}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default Permissions;
