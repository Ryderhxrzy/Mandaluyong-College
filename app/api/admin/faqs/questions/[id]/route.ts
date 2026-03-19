import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('faqs_items')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('faqs_data')
    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating FAQ item:', error)
    return Response.json({ error: 'Failed to update FAQ item' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin
      .from('faqs_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    await redis.del('faqs_data')
    return Response.json({ message: 'FAQ item deleted' })
  } catch (error) {
    console.error('Error deleting FAQ item:', error)
    return Response.json({ error: 'Failed to delete FAQ item' }, { status: 500 })
  }
}
