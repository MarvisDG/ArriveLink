'use server'

import { db } from '@/lib/db'
import { cities, companies, routes, featuredListings } from '@/lib/db/schema'
import { eq, ilike, and, gte } from 'drizzle-orm'

export async function searchRoutes(originCityId: number, destinationCityId: number) {
  try {
    const foundRoutes = await db
      .select({
        id: routes.id,
        originCityId: routes.originCityId,
        destinationCityId: routes.destinationCityId,
        companyId: routes.companyId,
        departureTime: routes.departureTime,
        arrivalTime: routes.arrivalTime,
        fare: routes.fare,
        busType: routes.busType,
        company: companies,
      })
      .from(routes)
      .leftJoin(companies, eq(routes.companyId, companies.id))
      .where(
        and(
          eq(routes.originCityId, originCityId),
          eq(routes.destinationCityId, destinationCityId)
        )
      )

    return foundRoutes
  } catch (error) {
    console.error('Error searching routes:', error)
    throw new Error('Failed to search routes')
  }
}

export async function getCities() {
  try {
    return await db.select().from(cities).orderBy(cities.name)
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw new Error('Failed to fetch cities')
  }
}

export async function getCityBySlug(slug: string) {
  try {
    const city = await db.select().from(cities).where(eq(cities.slug, slug))
    return city[0] || null
  } catch (error) {
    console.error('Error fetching city:', error)
    throw new Error('Failed to fetch city')
  }
}

export async function searchCities(query: string) {
  try {
    return await db
      .select()
      .from(cities)
      .where(ilike(cities.name, `%${query}%`))
      .limit(10)
  } catch (error) {
    console.error('Error searching cities:', error)
    throw new Error('Failed to search cities')
  }
}

export async function getFeaturedRoutes() {
  try {
    const featured = await db
      .select({
        routeId: featuredListings.routeId,
        companyId: featuredListings.companyId,
        featuredUntil: featuredListings.featuredUntil,
        route: routes,
        company: companies,
      })
      .from(featuredListings)
      .leftJoin(routes, eq(featuredListings.routeId, routes.id))
      .leftJoin(companies, eq(featuredListings.companyId, companies.id))
      .where(gte(featuredListings.featuredUntil, new Date()))

    return featured
  } catch (error) {
    console.error('Error fetching featured routes:', error)
    throw new Error('Failed to fetch featured routes')
  }
}
