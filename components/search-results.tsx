'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Route {
  id: number
  departureTime: string
  arrivalTime: string
  fare: number | null
  busType: string | null
  companyId: number
  companyName: string
  companyRating: string | number | null
  companyTotalReviews: number | null
}

interface SearchResultsProps {
  originCityId: number
  destinationCityId: number
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function SearchResults({
  originCityId,
  destinationCityId,
  searchParams,
}: SearchResultsProps) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          originCityId: originCityId.toString(),
          destinationCityId: destinationCityId.toString(),
        })

        // Add optional filters
        if (searchParams.minPrice) params.append('minPrice', String(searchParams.minPrice))
        if (searchParams.maxPrice) params.append('maxPrice', String(searchParams.maxPrice))
        if (searchParams.minRating) params.append('minRating', String(searchParams.minRating))
        if (searchParams.busType) params.append('busType', String(searchParams.busType))
        if (searchParams.sortBy) params.append('sortBy', String(searchParams.sortBy))
        const page = searchParams.page ? parseInt(String(searchParams.page)) : 1
        params.append('page', page.toString())

        const response = await fetch(`/api/routes/search?${params}`)
        const data = await response.json()

        if (data.error) {
          console.error('[v0] Search error:', data.error)
          return
        }

        setRoutes(data.data || [])
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
      } catch (error) {
        console.error('[v0] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [originCityId, destinationCityId, searchParams])

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading routes...</div>
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">No routes found matching your criteria</p>
        <Button variant="outline">Try different filters</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">
          {routes.length} route{routes.length !== 1 ? 's' : ''} found
        </h2>
        <div className="text-sm text-slate-600">
          Page {pagination.page} of {pagination.pages}
        </div>
      </div>

      <div className="space-y-3">
        {routes.map((route) => (
          <Card key={route.id} className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <p className="font-bold text-lg">{route.departureTime}</p>
                    <p className="text-sm text-slate-600">Departure</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">→</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{route.arrivalTime}</p>
                    <p className="text-sm text-slate-600">Arrival</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-slate-900">{route.companyName}</p>
                  <p className="text-sm text-slate-600">
                    {route.busType || 'Standard'} • Rating: {route.companyRating || 'N/A'}/5 ({route.companyTotalReviews || 0} reviews)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  ₦{route.fare ? route.fare.toLocaleString() : 'N/A'}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={`/company/${route.companyId}/route/${route.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={pagination.page === i + 1 ? 'default' : 'outline'}
              asChild
            >
              <a href={`?page=${i + 1}`}>{i + 1}</a>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
