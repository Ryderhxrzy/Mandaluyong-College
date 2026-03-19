import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'terms_data'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    const [heroRes, contentRes] = await Promise.all([
      supabaseAdmin.from('terms_and_conditions_hero').select('*').eq('is_active', true).limit(1).single(),
      supabaseAdmin.from('terms_and_conditions_sections').select('*').eq('is_active', true).order('order', { ascending: true })
    ])

    if (heroRes.error && heroRes.error.code !== 'PGRST116') throw heroRes.error
    if (contentRes.error) throw contentRes.error

    const data = {
      hero: heroRes.data || null,
      sections: contentRes.data || []
    }

    await redis.setex(cacheKey, 3600, data)

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching terms:', error)
    return Response.json({ error: 'Failed to fetch terms' }, { status: 500 })
  }
}
