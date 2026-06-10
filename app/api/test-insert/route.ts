import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export async function GET() {
  try {
    console.log('[v0] Attempting to insert user...')
    const result = await db.insert(user).values({
      id: 'test-user-' + Date.now(),
      email: 'test-' + Date.now() + '@example.com',
      emailVerified: false,
      name: null,
    }).returning()
    
    console.log('[v0] Insert successful:', result)
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('[v0] Insert error:', error)
    return Response.json({ 
      success: false, 
      error: String(error),
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
