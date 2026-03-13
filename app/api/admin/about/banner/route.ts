import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.banner)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const { data, error } = await supabaseAdmin
      .from('banner_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const responseData = data || {}

    // Cache the result
    await redis.setex(cacheKeys.banner, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    )
  }
}
