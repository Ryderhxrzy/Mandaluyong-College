import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('privacy_policy_sections')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('privacy_policy_data')
    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating privacy section:', error)
    return Response.json({ error: 'Failed to update privacy section' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin
      .from('privacy_policy_sections')
      .delete()
      .eq('id', id)

    if (error) throw error

    await redis.del('privacy_policy_data')
    return Response.json({ message: 'Privacy section deleted' })
  } catch (error) {
    console.error('Error deleting privacy section:', error)
    return Response.json({ error: 'Failed to delete privacy section' }, { status: 500 })
  }
}
