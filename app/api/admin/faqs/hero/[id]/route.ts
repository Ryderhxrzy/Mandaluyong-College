import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { data, error } = await supabaseAdmin
      .from('faqs_hero')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    // Clear cache
    await redis.del('faqs_data')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating FAQs hero:', error)
    return Response.json({ error: 'Failed to update FAQs hero' }, { status: 500 })
  }
}
