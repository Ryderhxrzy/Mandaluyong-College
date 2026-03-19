import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'news_announcements'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    const { data, error } = await supabaseAdmin
      .from('news_announcements')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (error) throw error

    await redis.setex(cacheKey, 3600, data)

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching news announcements:', error)
    return Response.json({ error: 'Failed to fetch news announcements' }, { status: 500 })
  }
}
