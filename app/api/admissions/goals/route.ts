import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'admissions_goals'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_goals')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    await redis.setex(cacheKey, 3600, data)

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return Response.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}
