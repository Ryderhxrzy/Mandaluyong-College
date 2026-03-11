import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Try to get from cache first
    const cached = await redis.get(cacheKeys.coreValues)
    if (cached) {
      return NextResponse.json({ data: cached })
    }

    const { data, error } = await supabaseAdmin
      .from('core_values_home_page')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const coreValuesData = data
      ? {
          id: data.id.toString(),
          title: data.title,
          description: data.description,
          background_image_url: data.background_image,
          is_active: data.is_active,
        }
      : null

    // Store in cache
    if (coreValuesData) {
      await redis.setex(cacheKeys.coreValues, CACHE_TTL, coreValuesData)
    }

    return NextResponse.json({
      data: coreValuesData,
    })
  } catch (error) {
    console.error('Error fetching core values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core values' },
      { status: 500 }
    )
  }
}

