import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.missionVision)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('mission_vision_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      mission: 'To cultivate a culture of excellence in Science and Technology pursuing the improvement of the quality of life of every Mandaleño to bring about the city\'s sustainable development and resiliency towards nation building.',
      vision: 'A college of distinction in Science and Technology committed to produce high caliber and employable graduates.',
    }

    if (!sectionData?.id) {
      // Cache default data
      await redis.setex(cacheKeys.missionVision, CACHE_TTL, defaultData)
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: sectionData.id,
      mission: sectionData.mission,
      vision: sectionData.vision,
    }

    // Cache the result
    await redis.setex(cacheKeys.missionVision, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching mission vision:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission vision' },
      { status: 500 }
    )
  }
}
