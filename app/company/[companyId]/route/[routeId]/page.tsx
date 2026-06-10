import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCompanyProfile, getUnlockedContacts } from '@/app/actions/companies'
import RouteDetailCard from '@/components/route-detail-card'
import CompanyProfile from '@/components/company-profile'

interface RouteDetailPageProps {
  params: {
    companyId: string
    routeId: string
  }
}

export default async function RouteDetailPage({
  params,
}: RouteDetailPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const companyId = parseInt(params.companyId)
  const routeId = parseInt(params.routeId)

  try {
    const [profile, unlocked] = await Promise.all([
      getCompanyProfile(companyId),
      getUnlockedContacts(routeId),
    ])

    const route = profile.routes.find((r: any) => r.route?.id === routeId)

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <RouteDetailCard
                route={route?.route}
                company={profile.company}
                routeId={routeId}
                companyId={companyId}
              />
              <CompanyProfile company={profile.company} reviews={profile.reviews} />
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Contact Info</h3>
              {unlocked ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-semibold text-slate-900">{unlocked.companyPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold text-slate-900">{unlocked.companyEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">WhatsApp</p>
                    <p className="font-semibold text-slate-900">{unlocked.companyWhatsapp}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-600 mb-4">
                    Pay ₦200 to unlock contact information
                  </p>
                  {/* Placeholder for Paystack integration */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md">
                    Unlock Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading route details:', error)
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Failed to load route details. Please try again.
          </div>
        </div>
      </main>
    )
  }
}
