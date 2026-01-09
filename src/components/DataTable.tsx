"use client"

import { motion } from "framer-motion"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ColumnDef } from "@tanstack/react-table"
import type { ReactNode } from "react"
import type { SortConfig } from "@/hooks/useDataTable"

// Simple column format for legacy pages
interface SimpleColumn {
  key: string
  header: string
  sortable?: boolean
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
  sortConfig?: SortConfig
  onPageChange?: (newSkip: number) => void
  onSearchChange?: (newSearch: string) => void
  onSortChange?: (key: string) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onRetry?: () => void
  children?: ReactNode
  // Selection props
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  // Custom actions render
  renderActions?: (item: T) => ReactNode
}

export const DataTable = <T extends { id: string }>({
  data,
  columns,
  isLoading,
  error,
  pagination,
  sortConfig,
  onPageChange,
  onSearchChange,
  onSortChange,
  onEdit,
  onDelete,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  renderActions,
}: DataTableProps<T>) => {
  // Selection handlers
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id))
  const isSomeSelected = data.some((item) => selectedIds.includes(item.id)) && !isAllSelected

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (isAllSelected) {
      // Deselect all current page items
      onSelectionChange(selectedIds.filter((id) => !data.some((item) => item.id === id)))
    } else {
      // Select all current page items
      const newIds = [...new Set([...selectedIds, ...data.map((item) => item.id)])]
      onSelectionChange(newIds)
    }
  }

  const handleSelectOne = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  // Calculate column span (columns + checkbox + actions)
  const hasActions = onEdit || onDelete || renderActions
  const totalColumns = columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
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

  // Check if column is sortable
  const isColumnSortable = (col: ColumnDef<T> | SimpleColumn): boolean => {
    if (isSimpleColumn(col)) {
      return col.sortable !== false // Default to true for simple columns
    }
    return false
  }

  // Render sort icon
  const renderSortIcon = (col: ColumnDef<T> | SimpleColumn) => {
    if (!onSortChange || !isColumnSortable(col)) return null

    const key = getColumnKey(col, 0)
    if (sortConfig?.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="w-4 h-4 ml-1 inline-block" />
      ) : (
        <ArrowDown className="w-4 h-4 ml-1 inline-block" />
      )
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 inline-block opacity-40" />
  }

  // Handle header click for sorting
  const handleHeaderClick = (col: ColumnDef<T> | SimpleColumn, index: number) => {
    if (onSortChange && isColumnSortable(col)) {
      const key = getColumnKey(col, index)
      onSortChange(key)
    }
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
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    title={isAllSelected ? "Tout deselectionner" : "Tout selectionner"}
                  />
                </TableHead>
              )}
              {columns.map((col, index) => (
                <TableHead
                  key={getColumnKey(col, index)}
                  className={onSortChange && isColumnSortable(col) ? "cursor-pointer select-none hover:bg-gray-100 transition-colors" : ""}
                  onClick={() => handleHeaderClick(col, index)}
                >
                  <span className="flex items-center">
                    {getHeaderText(col)}
                    {renderSortIcon(col)}
                  </span>
                </TableHead>
              ))}
              {hasActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={totalColumns}>
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
                <TableRow>
                    <TableCell colSpan={totalColumns} className="text-center py-8 text-red-500">
                        {error}
                    </TableCell>
                </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalColumns} className="text-center py-8">
                  Aucune donnée trouvée
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                  >
                    {selectable && (
                      <TableCell className="w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          title={isSelected ? "Deselectionner" : "Selectionner"}
                          aria-label={isSelected ? "Deselectionner cette ligne" : "Selectionner cette ligne"}
                        />
                      </TableCell>
                    )}
                    {columns.map((col, index) => (
                      <TableCell key={getColumnKey(col, index)}>
                        {getCellValue(item, col)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderActions && renderActions(item)}
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
                )
              })
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
