import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const cacheKey = 'admissions_cta'
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      return Response.json(cachedData)
    }

    // Fetch CTA settings (title + description)
    const { data: ctaData, error: ctaError } = await supabaseAdmin
      .from('admissions_cta')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (ctaError) throw ctaError

    // Fetch CTA images
    const { data: imagesData, error: imagesError } = await supabaseAdmin
      .from('admissions_cta_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (imagesError) throw imagesError

    const result = {
      ...ctaData,
      images: imagesData ?? [],
    }

    await redis.setex(cacheKey, 3600, result)

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching admissions CTA:', error)
    return Response.json({ error: 'Failed to fetch admissions CTA' }, { status: 500 })
  }
}
