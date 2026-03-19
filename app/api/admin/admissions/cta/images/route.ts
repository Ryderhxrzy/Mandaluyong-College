import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const { image_url, alt_text } = await request.json()

    if (!image_url) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const { data: maxData } = await supabaseAdmin
      .from('admissions_cta_images')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrder = (maxData && maxData.length > 0 ? maxData[0].order_index : 0) + 1

    const { data, error } = await supabaseAdmin
      .from('admissions_cta_images')
      .insert([{ image_url, alt_text: alt_text || 'MCST Image', order_index: nextOrder, is_active: true }])
      .select()

    if (error) throw error

    await redis.del('admissions_cta')

    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error adding CTA image:', error)
    return Response.json({ error: 'Failed to add CTA image' }, { status: 500 })
  }
}
