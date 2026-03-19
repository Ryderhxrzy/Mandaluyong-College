import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'admissions_required_strands'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(JSON.parse(cachedData as string))
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_required_strands')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    await redis.setex(cacheKey, 3600, JSON.stringify(data))

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching required strands:', error)
    return Response.json({ error: 'Failed to fetch required strands' }, { status: 500 })
  }
}
