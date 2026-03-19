import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.section_name) {
      return Response.json({ error: 'Section name is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_banner_settings')
      .insert([{ ...body, is_active: true }])
      .select()

    if (error) throw error

    await redis.del('admissions_banner_settings')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating banner settings:', error)
    return Response.json({ error: 'Failed to create banner settings' }, { status: 500 })
  }
}
