import { useState, useCallback, useEffect } from 'react'
import { useUrlParams } from './useUrlParams'

export interface PropertyFilters {
  minBedrooms?: string
  maxBedrooms?: string
  minBathrooms?: string
  maxBathrooms?: string
  minParking?: string
  maxParking?: string
  minPrice?: string
  maxPrice?: string
  minFloorArea?: string
  maxFloorArea?: string
  features?: string[]
  latitude?: string
  longitude?: string
  radius?: string
  minLatitude?: string
  maxLatitude?: string
  minLongitude?: string
  maxLongitude?: string
}

const DEFAULT_FILTERS: PropertyFilters = {
  minPrice: '0',
  maxPrice: '10000000',
}

export const usePropertyFilters = () => {
  const { getParam, getAllParams } = useUrlParams()
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(DEFAULT_FILTERS)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      minBedrooms: getParam('minBedrooms') || undefined,
      maxBedrooms: getParam('maxBedrooms') || undefined,
      minBathrooms: getParam('minBathrooms') || undefined,
      maxBathrooms: getParam('maxBathrooms') || undefined,
      minParking: getParam('minParking') || undefined,
      maxParking: getParam('maxParking') || undefined,
      minPrice: getParam('minPrice') || DEFAULT_FILTERS.minPrice,
      maxPrice: getParam('maxPrice') || DEFAULT_FILTERS.maxPrice,
      minFloorArea: getParam('minFloorArea') || undefined,
      maxFloorArea: getParam('maxFloorArea') || undefined,
      latitude: getParam('latitude') || undefined,
      longitude: getParam('longitude') || undefined,
      radius: getParam('radius') || undefined,
      minLatitude: getParam('minLatitude') || undefined,
      maxLatitude: getParam('maxLatitude') || undefined,
      minLongitude: getParam('minLongitude') || undefined,
      maxLongitude: getParam('maxLongitude') || undefined,
    }
    
    setLocalFilters(urlFilters)
  }, [getParam])

  /**
   * Check if current local filters differ from URL params
   */
  useEffect(() => {
    const currentUrlParams = getAllParams()
    const hasLocalChanges = Object.entries(localFilters).some(([key, value]) => {
      const urlValue = currentUrlParams[key]
      // Handle undefined/null values
      if (!value && !urlValue) return false
      return String(value || '') !== String(urlValue || '')
    })
    setHasChanges(hasLocalChanges)
  }, [localFilters, getAllParams])

  const updateFilter = useCallback((key: keyof PropertyFilters, value: string | string[] | null | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const updateMultipleFilters = useCallback((filters: Partial<PropertyFilters>) => {
    setLocalFilters(prev => ({
      ...prev,
      ...filters,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS)
  }, [])

  const getApplicableFilters = useCallback(() => {
    /**
     * Return only filters that have values (not null/undefined/empty)
     */
    const applicableFilters: Record<string, string> = {}
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            applicableFilters[key] = value.join(',')
          }
        } else {
          applicableFilters[key] = String(value)
        }
      }
    })
    
    return applicableFilters
  }, [localFilters])

  return {
    filters: localFilters,
    hasChanges,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
    getApplicableFilters,
  }
} 