import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('news_announcements')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('news_announcements')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating news announcement:', error)
    return Response.json({ error: 'Failed to update news announcement' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('news_announcements').delete().eq('id', id)

    if (error) throw error

    await redis.del('news_announcements')

    return Response.json({ message: 'Announcement deleted' })
  } catch (error) {
    console.error('Error deleting news announcement:', error)
    return Response.json({ error: 'Failed to delete news announcement' }, { status: 500 })
  }
}
