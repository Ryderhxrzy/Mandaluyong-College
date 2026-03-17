import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { program, strand_requirement } = await request.json()

    if (!program || !strand_requirement) {
      return Response.json({ error: 'Program and strand requirement are required' }, { status: 400 })
    }

    const { data: maxData } = await supabase
      .from('admissions_required_strands')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrder = (maxData && maxData.length > 0 ? maxData[0].order_index : 0) + 1

    const { data, error } = await supabase
      .from('admissions_required_strands')
      .insert([{ program, strand_requirement, order_index: nextOrder, is_active: true }])
      .select()

    if (error) throw error

    await redis.del('admissions_required_strands')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating strand:', error)
    return Response.json({ error: 'Failed to create strand' }, { status: 500 })
  }
}
