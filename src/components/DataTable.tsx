"use client"

import { motion } from "framer-motion"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ColumnDef } from "@tanstack/react-table"
import type { ReactNode } from "react"

// Simple column format for legacy pages
interface SimpleColumn {
  key: string
  header: string
}

// Check if column is SimpleColumn
function isSimpleColumn(col: unknown): col is SimpleColumn {
  return typeof col === 'object' && col !== null && 'key' in col && 'header' in col
}

// Union type for pagination - supports both new and legacy formats
interface NewPagination {
  pageIndex: number
  pageSize: number
  pageCount: number
}

interface LegacyPagination {
  skip?: number
  limit?: number
  total?: number
  search?: string
}

type PaginationType = NewPagination | LegacyPagination

// Check if pagination is new format
function isNewPagination(p: PaginationType): p is NewPagination {
  return 'pageIndex' in p && 'pageSize' in p && 'pageCount' in p
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[] | SimpleColumn[]
  isLoading: boolean
  error?: string | null
  pagination?: PaginationType
  onPageChange?: (newSkip: number) => void
  onSearchChange?: (newSearch: string) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onRetry?: () => void
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
  // Normalize pagination to common format
  let skip = 0
  let limit = 10
  let totalPages = 1
  let currentPage = 0

  if (pagination) {
    if (isNewPagination(pagination)) {
      skip = pagination.pageIndex * pagination.pageSize
      limit = pagination.pageSize
      totalPages = pagination.pageCount
      currentPage = pagination.pageIndex
    } else {
      skip = pagination.skip || 0
      limit = pagination.limit || 10
      const total = pagination.total || 0
      totalPages = Math.ceil(total / limit) || 1
      currentPage = Math.floor(skip / limit)
    }
  }

  // Get cell value based on column type
  const getCellValue = (item: T, col: ColumnDef<T> | SimpleColumn) => {
    if (isSimpleColumn(col)) {
      return (item as Record<string, unknown>)[col.key] ?? "N/A"
    }

    if (col.cell && typeof col.cell === 'function') {
      return col.cell({ row: { original: item }, getValue: () => null, renderValue: () => null } as never)
    }

    if ('accessorKey' in col && col.accessorKey) {
      return (item as Record<string, unknown>)[col.accessorKey as string] ?? "N/A"
    }

    return "N/A"
  }

  // Get column key for React key prop
  const getColumnKey = (col: ColumnDef<T> | SimpleColumn, index: number): string => {
    if (isSimpleColumn(col)) {
      return col.key
    }
    return col.id || ('accessorKey' in col ? String(col.accessorKey) : '') || String(index)
  }

  // Get header text
  const getHeaderText = (col: ColumnDef<T> | SimpleColumn): string => {
    if (isSimpleColumn(col)) {
      return col.header
    }
    if (typeof col.header === 'function') {
      return ''
    }
    return col.header as string || ''
  }

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Rechercher..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      )}

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={getColumnKey(col, index)}>
                  {getHeaderText(col)}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
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
                  {columns.map((col, index) => (
                    <TableCell key={getColumnKey(col, index)}>
                      {getCellValue(item, col)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-accent">
            Page {currentPage + 1} sur {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(skip - limit)}
              disabled={currentPage === 0}
              className="btn-icon"
              title="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(skip + limit)}
              disabled={currentPage >= totalPages - 1}
              className="btn-icon"
              title="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
