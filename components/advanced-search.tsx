'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { CityAutocomplete } from '@/components/city-autocomplete'

interface SearchFilters {
  originCityId: string
  destinationCityId: string
  minPrice: string
  maxPrice: string
  minRating: string
  busType: string
}

export function AdvancedSearch() {
  const router = useRouter()
  const [filters, setFilters] = useState<SearchFilters>({
    originCityId: '',
    destinationCityId: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    busType: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!filters.originCityId || !filters.destinationCityId) {
      alert('Please select both origin and destination cities')
      setLoading(false)
      return
    }

    // Build query params
    const params = new URLSearchParams()
    params.set('originCityId', filters.originCityId)
    params.set('destinationCityId', filters.destinationCityId)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minRating) params.set('minRating', filters.minRating)
    if (filters.busType) params.set('busType', filters.busType)

    router.push(`/search?${params.toString()}`)
    setLoading(false)
  }, [filters, router])

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-6 bg-white">
        <h2 className="text-2xl font-bold mb-6">Find Your Route</h2>
        
        <form onSubmit={handleSearch} className="space-y-6">
          {/* City Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <CityAutocomplete
                id="origin"
                value={filters.originCityId}
                onChange={(cityId) => handleFilterChange('originCityId', cityId)}
                placeholder="Select departure city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <CityAutocomplete
                id="destination"
                value={filters.destinationCityId}
                onChange={(cityId) => handleFilterChange('destinationCityId', cityId)}
                placeholder="Select destination city"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price (₦)</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price (₦)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minRating">Min Rating</Label>
              <select
                id="minRating"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Any</option>
                <option value="3">3+</option>
                <option value="3.5">3.5+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="busType">Bus Type</Label>
              <select
                id="busType"
                value={filters.busType}
                onChange={(e) => handleFilterChange('busType', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Any</option>
                <option value="Standard">Standard</option>
                <option value="AC Luxury">AC Luxury</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10"
          >
            {loading ? 'Searching...' : 'Search Routes'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
