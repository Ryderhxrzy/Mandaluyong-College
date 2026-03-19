import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.step_title) {
      return Response.json({ error: 'Step title is required' }, { status: 400 })
    }

    const { data: maxData } = await supabaseAdmin
      .from('admissions_admission_procedures')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrder = (maxData && maxData.length > 0 ? maxData[0].order_index : 0) + 1

    const { data, error } = await supabaseAdmin
      .from('admissions_admission_procedures')
      .insert([{ ...body, order_index: nextOrder, is_active: true }])
      .select()

    if (error) throw error

    await redis.del('admissions_admission_procedures')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating procedure:', error)
    return Response.json({ error: 'Failed to create procedure' }, { status: 500 })
  }
}
