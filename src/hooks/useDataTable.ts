import { useState, useEffect, useCallback } from "react"
import type { PaginatedResponse, PaginationParams } from "../types"

interface UseDataTableProps<T> {
  fetchData: (params: PaginationParams) => Promise<PaginatedResponse<T>>
}

const useDataTable = <T>({ fetchData }: UseDataTableProps<T>) => {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationParams>({
    skip: 0,
    limit: 10,
    search: "",
  })
  const [total, setTotal] = useState(0)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchData(pagination)
      
      if (!response) {
        throw new Error("Aucune réponse reçue")
      }

      setData(response.items || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
      setError("Impossible de charger les données. Veuillez réessayer.")
      setData([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [fetchData, pagination])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePageChange = (newSkip: number) => {
    setPagination((prev) => ({ ...prev, skip: newSkip }))
  }

  const handleSearchChange = (newSearch: string) => {
    setPagination((prev) => ({ ...prev, search: newSearch, skip: 0 }))
  }

  const refresh = () => {
    loadData()
  }

  return {
    data,
    isLoading,
    error,
    pagination: { ...pagination, total },
    handlePageChange,
    handleSearchChange,
    refresh,
  }
}

export default useDataTable