'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface RouteDetailCardProps {
  route: any
  company: any
  routeId: number
  companyId: number
}

export default function RouteDetailCard({
  route,
  company,
  routeId,
  companyId,
}: RouteDetailCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="space-y-6">
        {/* Route Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {company?.name}
          </h1>
          <p className="text-slate-600">
            Bus Type: {route?.busType || 'Not specified'}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">
              {route?.departureTime || '--:--'}
            </p>
            <p className="text-sm text-slate-600 mt-1">Departure</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">
              {route?.arrivalTime || '--:--'}
            </p>
            <p className="text-sm text-slate-600 mt-1">Arrival</p>
          </div>
        </div>

        {/* Fare */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-1">Fare per seat</p>
          <p className="text-3xl font-bold text-blue-600">
            ₦{Number(route?.fare || 0).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Book Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-slate-300 text-slate-900 hover:bg-slate-50"
          >
            Save Route
          </Button>
        </div>
      </div>
    </div>
  )
}
