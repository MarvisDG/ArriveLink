import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import SearchResults from '@/components/search-results'
import { AdvancedSearch } from '@/components/advanced-search'

export const metadata = {
  title: 'Search Routes - ArriveLink',
  description: 'Search for bus routes across Nigeria',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const originCityId = searchParams.originCityId as string
  const destinationCityId = searchParams.destinationCityId as string

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ArriveLink</h1>
          <div className="text-sm text-slate-600">
            Welcome, {session.user.email}
          </div>
        </div>
      </div>

      {/* New Search */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdvancedSearch />
      </div>

      {/* Results */}
      {originCityId && destinationCityId && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Suspense fallback={<div className="text-center py-8">Loading routes...</div>}>
            <SearchResults
              originCityId={parseInt(originCityId)}
              destinationCityId={parseInt(destinationCityId)}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      )}
    </main>
  )
}
