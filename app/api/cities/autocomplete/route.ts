import { db } from '@/lib/db'
import { cities } from '@/lib/db/schema'
import { ilike } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!q || q.length < 1) {
      return NextResponse.json({ data: [] })
    }

    const results = await db
      .select({
        id: cities.id,
        name: cities.name,
        state: cities.state,
        slug: cities.slug,
      })
      .from(cities)
      .where(ilike(cities.name, `%${q}%`))
      .limit(limit)

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('[v0] Autocomplete error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}
