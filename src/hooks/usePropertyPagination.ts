import { PropertyDetail } from '@/lib/queries/server/propety/type';
import { useState, useMemo } from 'react';

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

interface UsePropertyPaginationProps {
  properties: PropertyDetail[];
  backendPagination?: PaginationMeta | null;
  itemsPerPage?: number;
}

export function usePropertyPagination({
  properties,
  backendPagination,
  itemsPerPage = 12,
}: UsePropertyPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedProperties, totalPages, hasBackendPagination } =
    useMemo(() => {
      // Check if backend pagination is meaningful (more than 1 page)
      const hasMeaningfulBackendPagination =
        backendPagination?.totalPages && backendPagination.totalPages > 1;

      // If backend provides meaningful pagination, use it
      if (hasMeaningfulBackendPagination) {
        return {
          paginatedProperties: properties,
          totalPages: backendPagination.totalPages,
          hasBackendPagination: true,
        };
      }

      // Otherwise, implement frontend pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProperties = properties.slice(startIndex, endIndex);
      const totalPages = Math.ceil(properties.length / itemsPerPage);

      return {
        paginatedProperties,
        totalPages,
        hasBackendPagination: false,
      };
    }, [properties, backendPagination, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (!hasBackendPagination) {
      setCurrentPage(page);
    }
  };

  return {
    paginatedProperties,
    currentPage: hasBackendPagination
      ? backendPagination?.page || 1
      : currentPage,
    totalPages,
    hasBackendPagination,
    handlePageChange,
  };
}
