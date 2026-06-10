'use client'

import { useState } from 'react'
import { searchRoutes, getCities } from '@/app/actions/search'
import { Button } from '@/components/ui/button'
import CitySelect from './city-select'
import RouteResults from './route-results'

export default function SearchSection() {
  const [originCity, setOriginCity] = useState<number | null>(null)
  const [destinationCity, setDestinationCity] = useState<number | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!originCity || !destinationCity) {
      alert('Please select both origin and destination cities')
      return
    }

    setLoading(true)
    try {
      const routes = await searchRoutes(originCity, destinationCity)
      setResults(routes)
      setSearched(true)
    } catch (error) {
      console.error('Search failed:', error)
      alert('Failed to search routes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ArriveLink</h1>
          <div className="text-sm text-slate-600">
            Find & book bus routes across Nigeria
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                From
              </label>
              <CitySelect value={originCity} onChange={setOriginCity} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                To
              </label>
              <CitySelect value={destinationCity} onChange={setDestinationCity} />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Searching...' : 'Search Routes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {searched && <RouteResults routes={results} />}
      </div>
    </div>
  )
}
