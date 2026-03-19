import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseAdmin
      .from('faqs_items')
      .insert([{ ...body, updated_at: new Date().toISOString() }])
      .select()

    if (error) throw error

    await redis.del('faqs_data')
    return Response.json(data[0])
  } catch (error) {
    console.error('Error creating FAQ item:', error)
    return Response.json({ error: 'Failed to create FAQ item' }, { status: 500 })
  }
}
