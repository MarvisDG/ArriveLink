import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import SearchSection from '@/components/search-section'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  // if (!session?.user) {
  //   redirect('/sign-in')
  // }

  return (
    <main className="flex-1">
      <SearchSection />
    </main>
  )
}
