import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdvancedSearch } from '@/components/advanced-search'

export const metadata = {
  title: 'ArriveLink - Find Bus Routes',
  description: 'Search and book intercity bus routes across Nigeria',
}

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ArriveLink</h1>
            <p className="text-sm text-slate-600 mt-1">Find & book intercity bus routes</p>
          </div>
          <div className="text-sm text-slate-600">
            Welcome, {session.user.name || session.user.email}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <AdvancedSearch />
      </div>
    </main>
  )
}
