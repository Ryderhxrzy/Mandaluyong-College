import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const { goal_text, icon_name } = await request.json()

    if (!goal_text) {
      return Response.json({ error: 'Goal text is required' }, { status: 400 })
    }

    const { data: maxData } = await supabaseAdmin
      .from('admissions_goals')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrder = (maxData && maxData.length > 0 ? maxData[0].order_index : 0) + 1

    const { data, error } = await supabaseAdmin
      .from('admissions_goals')
      .insert([{ goal_text, icon_name: icon_name || 'BookOpen', order_index: nextOrder, is_active: true }])
      .select()

    if (error) throw error

    await redis.del('admissions_goals')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return Response.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}
