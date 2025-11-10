/**
 * Pagination Utilities for Mock Data
 *
 * Provides client-side pagination, filtering, and sorting for mock data
 */

import { PaginatedResponse, PaginationParams } from '../../types';

/**
 * Converts page-based parameters to skip/limit format
 */
export function pageToSkipLimit(page?: string | number, pageSize?: string | number): { skip: number; limit: number } {
  const pageNum = typeof page === 'string' ? parseInt(page) || 1 : (page || 1);
  const limitNum = typeof pageSize === 'string' ? parseInt(pageSize) || 10 : (pageSize || 10);
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum
  };
}

/**
 * Paginates an array of items
 */
export function paginate<T>(
  items: T[],
  params?: PaginationParams
): PaginatedResponse<T> {
  const skip = params?.skip || 0;
  const limit = params?.limit || 10;

  const paginatedItems = items.slice(skip, skip + limit);

  return {
    items: paginatedItems,
    total: items.length,
    skip,
    limit,
  };
}

/**
 * Filters items by search query across multiple fields
 */
export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  searchQuery: string | undefined,
  searchFields: (keyof T)[]
): T[] {
  if (!searchQuery) return items;

  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(query);
    })
  );
}

/**
 * Sorts items by a specific field
 */
export function sortBy<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Generic filter function for mock data
 */
export function applyFilters<T extends Record<string, any>>(
  items: T[],
  filters: Record<string, any>
): T[] {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      return item[key] === value;
    });
  });
}
