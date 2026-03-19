import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('terms_and_conditions_sections')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('terms_and_conditions_data')
    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating terms section:', error)
    return Response.json({ error: 'Failed to update terms section' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin
      .from('terms_and_conditions_sections')
      .delete()
      .eq('id', id)

    if (error) throw error

    await redis.del('terms_and_conditions_data')
    return Response.json({ message: 'Terms section deleted' })
  } catch (error) {
    console.error('Error deleting terms section:', error)
    return Response.json({ error: 'Failed to delete terms section' }, { status: 500 })
  }
}
