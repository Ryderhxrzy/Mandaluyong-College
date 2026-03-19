import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'news_cta'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    const { data, error } = await supabaseAdmin
      .from('news_cta')
      .select(`
        *,
        news_cta_images (
          id,
          image_url,
          "order"
        )
      `)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      await redis.setex(cacheKey, 3600, data)
    }

    return Response.json(data || null)
  } catch (error) {
    console.error('Error fetching news cta:', error)
    return Response.json({ error: 'Failed to fetch news cta' }, { status: 500 })
  }
}
