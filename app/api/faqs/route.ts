import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'faqs_data'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    const [heroRes, itemsRes] = await Promise.all([
      supabaseAdmin.from('faqs_hero').select('*').eq('is_active', true).limit(1).single(),
      supabaseAdmin.from('faqs_items').select('*').order('order', { ascending: true })
    ])

    if (heroRes.error && heroRes.error.code !== 'PGRST116') throw heroRes.error
    if (itemsRes.error) throw itemsRes.error

    const data = {
      hero: heroRes.data || null,
      items: itemsRes.data || []
    }

    await redis.setex(cacheKey, 3600, data)

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return Response.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

