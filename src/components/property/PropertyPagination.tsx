'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function PropertyPagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PropertyPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'border border-neutral-mid/20 bg-white hover:bg-neutral-light',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
          'text-neutral-main hover:text-neutral-text'
        )}
      >
        <ChevronLeft className='w-4 h-4' />
        <span className='hidden sm:block'>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className='flex items-center gap-1'>
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className='px-3 py-2 text-neutral-mid text-sm'
              >
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-main text-white shadow-sm'
                  : 'text-neutral-main hover:bg-neutral-light hover:text-neutral-text border border-neutral-mid/20 bg-white'
              )}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          'border border-neutral-mid/20 bg-white hover:bg-neutral-light',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
          'text-neutral-main hover:text-neutral-text'
        )}
      >
        <span className='hidden sm:block'>Next</span>
        <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  )
} 