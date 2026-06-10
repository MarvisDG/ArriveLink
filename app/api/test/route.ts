import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export async function GET() {
  try {
    console.log('[v0] Testing database connection...')
    const result = await db.select().from(user).limit(1)
    console.log('[v0] DB connection works, result:', result)
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('[v0] DB error:', error)
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
