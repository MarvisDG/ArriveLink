'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { companies, reviews, unlocks, routes, cities } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getCompanyProfile(companyId: number) {
  try {
    const company = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1)

    if (!company[0]) {
      throw new Error('Company not found')
    }

    const companyReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.companyId, companyId))
      .orderBy(reviews.createdAt)

    const companyRoutes = await db
      .select({
        route: routes,
        originCity: cities,
      })
      .from(routes)
      .leftJoin(cities, eq(routes.originCityId, cities.id))
      .where(eq(routes.companyId, companyId))

    return {
      company: company[0],
      reviews: companyReviews,
      routes: companyRoutes,
    }
  } catch (error) {
    console.error('Error fetching company profile:', error)
    throw new Error('Failed to fetch company profile')
  }
}

export async function createReview(
  companyId: number,
  rating: number,
  comment: string
) {
  const userId = await getUserId()

  try {
    const review = await db
      .insert(reviews)
      .values({
        companyId,
        userId,
        rating,
        comment,
      })
      .returning()

    // Update company rating
    const allReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.companyId, companyId))

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await db
      .update(companies)
      .set({
        rating: avgRating.toFixed(1),
        totalReviews: allReviews.length,
      })
      .where(eq(companies.id, companyId))

    return review[0]
  } catch (error) {
    console.error('Error creating review:', error)
    throw new Error('Failed to create review')
  }
}

export async function unlockCompanyContact(routeId: number, companyId: number) {
  const userId = await getUserId()

  try {
    // Check if already unlocked
    const existing = await db
      .select()
      .from(unlocks)
      .where(and(eq(unlocks.routeId, routeId), eq(unlocks.userId, userId)))

    if (existing.length > 0) {
      return existing[0]
    }

    // Get company contact info (placeholder - would come from company profile in Phase 2)
    const unlock = await db
      .insert(unlocks)
      .values({
        routeId,
        userId,
        companyPhone: '+234 1234 5678',
        companyEmail: 'contact@company.com',
        companyWhatsapp: '+234 1234 5678',
      })
      .returning()

    return unlock[0]
  } catch (error) {
    console.error('Error unlocking company contact:', error)
    throw new Error('Failed to unlock company contact')
  }
}

export async function getUnlockedContacts(routeId: number) {
  const userId = await getUserId()

  try {
    const unlock = await db
      .select()
      .from(unlocks)
      .where(and(eq(unlocks.routeId, routeId), eq(unlocks.userId, userId)))

    return unlock[0] || null
  } catch (error) {
    console.error('Error fetching unlocked contacts:', error)
    throw new Error('Failed to fetch unlocked contacts')
  }
}
