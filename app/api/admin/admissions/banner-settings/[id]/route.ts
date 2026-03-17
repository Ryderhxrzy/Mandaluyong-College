import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = parseInt(params.id)

    const { data, error } = await supabase
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const { error } = await supabase.from('admissions_banner_settings').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_banner_settings')

    return Response.json({ message: 'Banner settings deleted' })
  } catch (error) {
    console.error('Error deleting banner settings:', error)
    return Response.json({ error: 'Failed to delete banner settings' }, { status: 500 })
  }
}
