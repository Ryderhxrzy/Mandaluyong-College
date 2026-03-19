import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { goal_text, icon_name } = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (!goal_text) {
      return Response.json({ error: 'Goal text is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('admissions_goals').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_goals')

    return Response.json({ message: 'Goal deleted' })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return Response.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
