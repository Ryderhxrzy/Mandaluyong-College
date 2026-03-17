import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const cacheKey = 'admissions_goals'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(JSON.parse(cachedData as string))
    }

    const { data, error } = await supabase
      .from('admissions_goals')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    await redis.setex(cacheKey, 3600, JSON.stringify(data))

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return Response.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}
