import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ctaId = searchParams.get('cta_id')
    const body = await request.json()

    if (!ctaId) {
      return Response.json({ error: 'CTA ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('news_cta_images')
      .insert([{ ...body, news_cta_id: parseInt(ctaId) }])
      .select()

    if (error) throw error

    await redis.del('news_cta')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error adding news cta image:', error)
    return Response.json({ error: 'Failed to add news cta image' }, { status: 500 })
  }
}
