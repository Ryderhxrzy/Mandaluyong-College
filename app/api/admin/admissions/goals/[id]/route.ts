import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { goal_text, icon_name } = await request.json()
    const id = parseInt(params.id)

    if (!goal_text) {
      return Response.json({ error: 'Goal text is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('admissions_goals')
      .update({ goal_text, icon_name: icon_name || 'BookOpen', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_goals')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating goal:', error)
    return Response.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const { error } = await supabase.from('admissions_goals').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_goals')

    return Response.json({ message: 'Goal deleted' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return Response.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
