'use client'

import { useState } from 'react'
import { seedDatabase } from '@/app/actions/seed'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await seedDatabase()
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-lg border border-slate-200 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Seed Database</h1>
        <p className="text-slate-600 mb-6">
          This will populate the database with sample cities, companies, and routes for testing.
        </p>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-medium">{result.message}</p>
            {result.citiesCount && (
              <>
                <p className="text-green-700 text-sm">Cities: {result.citiesCount}</p>
                <p className="text-green-700 text-sm">Companies: {result.companiesCount}</p>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Button
          onClick={handleSeed}
          disabled={loading || result?.success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Seeding...' : result?.success ? 'Seeded!' : 'Seed Now'}
        </Button>
      </div>
    </main>
  )
}
