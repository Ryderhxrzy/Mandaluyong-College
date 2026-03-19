import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

interface DocumentaryRequirement {
  id: number
  requirement_text: string
  requirement_type: string
  parent_requirement_id: number | null
  order_index: number
  is_active: boolean
}

interface GroupedRequirement extends DocumentaryRequirement {
  sub_requirements?: DocumentaryRequirement[]
}

export async function GET() {
  try {
    const cacheKey = 'admissions_documentary_requirements'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(JSON.parse(cachedData as string))
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_documentary_requirements')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error

    // Group main requirements with their sub-requirements
    const mainRequirements = data.filter(req => req.requirement_type === 'main')
    const subRequirements = data.filter(req => req.requirement_type === 'sub')

    const groupedData: GroupedRequirement[] = mainRequirements.map(main => ({
      ...main,
      sub_requirements: subRequirements.filter(sub => sub.parent_requirement_id === main.id),
    }))

    await redis.setex(cacheKey, 3600, JSON.stringify(groupedData))

    return Response.json(groupedData)
  } catch (error) {
    console.error('Error fetching documentary requirements:', error)
    return Response.json({ error: 'Failed to fetch documentary requirements' }, { status: 500 })
  }
}
