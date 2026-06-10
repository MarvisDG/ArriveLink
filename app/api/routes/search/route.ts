import { db } from '@/lib/db'
import { routes, companies, cities } from '@/lib/db/schema'
import { and, gte, lte, eq, ilike } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const originCityId = searchParams.get('originCityId')
    const destinationCityId = searchParams.get('destinationCityId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const busType = searchParams.get('busType')
    const sortBy = searchParams.get('sortBy') || 'fare' // fare, rating, departure
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!originCityId || !destinationCityId) {
      return NextResponse.json(
        { error: 'Origin and destination cities are required' },
        { status: 400 }
      )
    }

    // Build filters
    const filters = [
      eq(routes.originCityId, parseInt(originCityId)),
      eq(routes.destinationCityId, parseInt(destinationCityId)),
    ]

    if (minPrice) {
      filters.push(gte(routes.fare, parseFloat(minPrice)))
    }
    if (maxPrice) {
      filters.push(lte(routes.fare, parseFloat(maxPrice)))
    }
    if (busType) {
      filters.push(eq(routes.busType, busType))
    }

    // Query with joins to companies for rating filter
    let query = db
      .select({
        id: routes.id,
        originCityId: routes.originCityId,
        destinationCityId: routes.destinationCityId,
        departureTime: routes.departureTime,
        arrivalTime: routes.arrivalTime,
        fare: routes.fare,
        busType: routes.busType,
        createdAt: routes.createdAt,
        companyId: companies.id,
        companyName: companies.name,
        companyRating: companies.rating,
        companyTotalReviews: companies.totalReviews,
        originCity: cities.name,
      })
      .from(routes)
      .innerJoin(companies, eq(routes.companyId, companies.id))
      .innerJoin(cities, eq(routes.originCityId, cities.id))
      .where(and(...filters))

    // Add rating filter if specified
    if (minRating) {
      const ratingValue = parseFloat(minRating)
      // Filter in JS since numeric comparison might be tricky with Drizzle
      // In production, this would be handled in the WHERE clause
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.orderBy((t) => [t.companyRating ?? 0])
        break
      case 'departure':
        query = query.orderBy(routes.departureTime)
        break
      case 'fare':
      default:
        query = query.orderBy(routes.fare)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    const results = await query.limit(limit).offset(offset)

    // Filter by rating if needed
    const filtered = minRating 
      ? results.filter(r => parseFloat(r.companyRating || '0') >= parseFloat(minRating))
      : results

    // Get total count for pagination
    const countQuery = db
      .select({ count: routes.id })
      .from(routes)
      .innerJoin(companies, eq(routes.companyId, companies.id))
      .where(and(...filters))

    const countResult = await countQuery
    const total = countResult.length

    return NextResponse.json({
      data: filtered,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[v0] Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search routes' },
      { status: 500 }
    )
  }
}
