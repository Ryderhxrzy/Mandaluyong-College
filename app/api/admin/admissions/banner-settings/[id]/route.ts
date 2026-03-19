import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('admissions_banner_settings')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_banner_settings')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating banner settings:', error)
    return Response.json({ error: 'Failed to update banner settings' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('admissions_banner_settings').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_banner_settings')

    return Response.json({ message: 'Banner settings deleted' })
  } catch (error) {
    console.error('Error deleting banner settings:', error)
    return Response.json({ error: 'Failed to delete banner settings' }, { status: 500 })
  }
}
