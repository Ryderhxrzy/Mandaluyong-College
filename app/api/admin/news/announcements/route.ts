import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseAdmin
      .from('news_announcements')
      .insert([body])
      .select()

    if (error) throw error

    await redis.del('news_announcements')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error creating news announcement:', error)
    return Response.json({ error: 'Failed to create news announcement' }, { status: 500 })
  }
}
