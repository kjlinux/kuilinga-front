import { useState, useEffect, useCallback } from "react"

// Generic interface for paginated responses
// OpenAPI generates specific types like PaginatedResponseEmployee, PaginatedResponseOrganization, etc.
// This interface provides a common shape for the hook to work with any entity
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export type SortDirection = "asc" | "desc"

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortDirection;
}

interface UseDataTableProps<T> {
  fetchData: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  clientSideSort?: boolean; // If true, sorting is done client-side instead of server-side
  clientSideSearch?: boolean; // If true, search is done client-side instead of server-side
  searchKeys?: string[]; // Keys to search in for client-side search (default: ["name", "description"])
}

const useDataTable = <T>({
  fetchData,
  defaultSortKey = "created_at",
  defaultSortDirection = "desc",
  clientSideSort = false,
  clientSideSearch = false,
  searchKeys = ["name", "description"]
}: UseDataTableProps<T>) => {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultSortKey,
    direction: defaultSortDirection,
  })
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
    sort_by: defaultSortKey,
    sort_order: defaultSortDirection,
  })
  const [total, setTotal] = useState(0)

  // Client-side sort function
  const sortData = useCallback((items: T[], key: string, direction: SortDirection): T[] => {
    return [...items].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[key]
      const bValue = (b as Record<string, unknown>)[key]

      if (aValue === null || aValue === undefined) return direction === "asc" ? 1 : -1
      if (bValue === null || bValue === undefined) return direction === "asc" ? -1 : 1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue, "fr", { sensitivity: "base" })
          : bValue.localeCompare(aValue, "fr", { sensitivity: "base" })
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1
      if (aValue > bValue) return direction === "asc" ? 1 : -1
      return 0
    })
  }, [])

  // Client-side search function
  const filterData = useCallback((items: T[], searchTerm: string, keys: string[]): T[] => {
    if (!searchTerm.trim()) return items
    const lowerSearch = searchTerm.toLowerCase().trim()
    return items.filter((item) => {
      return keys.some((key) => {
        const value = (item as Record<string, unknown>)[key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(lowerSearch)
      })
    })
  }, [])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // For client-side search, don't pass search to API
      const apiParams = clientSideSearch
        ? { ...pagination, search: undefined }
        : pagination
      const response = await fetchData(apiParams)

      if (!response) {
        throw new Error("Aucune réponse reçue")
      }

      let items = response.items || []
      let totalCount = response.total || 0

      // Apply client-side search if enabled
      if (clientSideSearch && pagination.search) {
        items = filterData(items, pagination.search, searchKeys)
        totalCount = items.length
      }

      // Apply client-side sorting if enabled
      if (clientSideSort && sortConfig.key) {
        items = sortData(items, sortConfig.key, sortConfig.direction)
      }

      setData(items)
      setTotal(totalCount)
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      setError("Impossible de charger les données. Veuillez réessayer.")
      setData([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [fetchData, pagination, clientSideSort, clientSideSearch, searchKeys, sortConfig, sortData, filterData])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePageChange = (newSkip: number) => {
    setPagination((prev) => ({ ...prev, skip: newSkip }))
  }

  const handleSearchChange = (newSearch: string) => {
    setPagination((prev) => ({ ...prev, search: newSearch, skip: 0 }))
  }

  const handleSortChange = (key: string) => {
    const newDirection: SortDirection =
      sortConfig.key === key && sortConfig.direction === "desc" ? "asc" : "desc"

    setSortConfig({ key, direction: newDirection })
    setPagination((prev) => ({
      ...prev,
      sort_by: key,
      sort_order: newDirection,
      skip: 0, // Reset to first page when sorting changes
    }))
  }

  const refresh = (resetToFirstPage = true) => {
    if (resetToFirstPage) {
      setPagination((prev) => ({ ...prev, skip: 0 }))
    }
    loadData()
  }

  return {
    data,
    isLoading,
    error,
    pagination: { ...pagination, total },
    sortConfig,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    refresh,
    setData,
  }
}

export default useDataTable
