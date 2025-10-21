"use client"

import { motion } from "framer-motion"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading: boolean
  error?: string | null
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
  }
  onPageChange?: (newSkip: number) => void
  onSearchChange?: (newSearch: string) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onRetry: () => void
  children?: ReactNode
}

export const DataTable = <T extends { id: string }>({
  data,
  columns,
  isLoading,
  error,
  pagination,
  onPageChange,
  onSearchChange,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  const { skip, limit, total, search } = pagination
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-red-500">
                        {error}
                    </TableCell>
                </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  Aucune donnée trouvée
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {String(item[col.key] ?? "N/A")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-accent">
          Page {Math.floor(skip / limit) + 1} sur {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(skip - limit)}
            disabled={skip === 0}
            className="btn-icon"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(skip + limit)}
            disabled={skip + limit >= total}
            className="btn-icon"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable