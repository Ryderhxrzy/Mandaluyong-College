import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.philosophy)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('philosophy_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      title: 'Philosophy',
      description: '',
      image: '',
      image_alt: '',
    }

    if (!sectionData?.id) {
      // Cache default data
      await redis.setex(cacheKeys.philosophy, CACHE_TTL, defaultData)
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: sectionData.id,
      title: sectionData.title,
      description: sectionData.description,
      image: sectionData.image || '',
      image_alt: sectionData.image_alt || '',
    }

    // Cache the result
    await redis.setex(cacheKeys.philosophy, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching philosophy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch philosophy' },
      { status: 500 }
    )
  }
}
