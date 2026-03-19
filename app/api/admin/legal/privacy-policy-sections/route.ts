import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, error } = await supabaseAdmin
      .from('privacy_policy_sections')
      .insert([{ ...body, updated_at: new Date().toISOString() }])
      .select()

    if (error) throw error

    await redis.del('privacy_policy_data')
    return Response.json(data[0])
  } catch (error) {
    console.error('Error creating privacy section:', error)
    return Response.json({ error: 'Failed to create privacy section' }, { status: 500 })
  }
}
