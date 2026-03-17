import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { qualification_text } = await request.json()

    if (!qualification_text) {
      return Response.json({ error: 'Qualification text is required' }, { status: 400 })
    }

    // Get max order_index
    const { data: maxData } = await supabase
      .from('admissions_qualifications')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrder = (maxData && maxData.length > 0 ? maxData[0].order_index : 0) + 1

    const { data, error } = await supabase
      .from('admissions_qualifications')
      .insert([{ qualification_text, order_index: nextOrder, is_active: true }])
      .select()

    if (error) throw error

    // Invalidate cache
    await redis.del('admissions_qualifications')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating qualification:', error)
    return Response.json({ error: 'Failed to create qualification' }, { status: 500 })
  }
}
