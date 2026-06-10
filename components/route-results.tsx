'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RouteResultsProps {
  routes: any[]
}

export default function RouteResults({ routes }: RouteResultsProps) {
  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No routes found. Try different cities.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">
        {routes.length} route{routes.length !== 1 ? 's' : ''} found
      </h2>

      {routes.map((route) => (
        <div
          key={route.id}
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Company Info */}
            <div>
              <p className="text-sm text-slate-600">Company</p>
              <p className="font-semibold text-slate-900">{route.company?.name || 'Unknown'}</p>
              {route.company?.rating && (
                <p className="text-sm text-yellow-600">
                  ⭐ {Number(route.company.rating).toFixed(1)} ({route.company.totalReviews} reviews)
                </p>
              )}
            </div>

            {/* Times */}
            <div>
              <p className="text-sm text-slate-600">Departure</p>
              <p className="font-semibold text-slate-900">
                {route.departureTime || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Arrival</p>
              <p className="font-semibold text-slate-900">
                {route.arrivalTime || 'N/A'}
              </p>
            </div>

            {/* Price & Button */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-sm text-slate-600">Fare</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₦{Number(route.fare || 0).toLocaleString()}
                </p>
              </div>
              <Link href={`/company/${route.companyId}/route/${route.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
