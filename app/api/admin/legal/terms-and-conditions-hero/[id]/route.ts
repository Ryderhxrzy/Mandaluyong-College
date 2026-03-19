import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('terms_and_conditions_hero')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    // Clear cache
    await redis.del('terms_and_conditions_data')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating terms hero:', error)
    return Response.json({ error: 'Failed to update terms hero' }, { status: 500 })
  }
}
