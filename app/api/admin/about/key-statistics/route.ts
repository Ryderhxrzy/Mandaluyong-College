import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.keyStatistics)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('key_statistics_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      title: 'Discover Our Impact: Key Statistics at Mandaluyong College of Science and Technology',
      description: 'At MCST, we pride ourselves on our vibrant community. Our commitment to excellence is reflected in our impressive statistics.',
      items: [],
      images: [],
    }

    if (!sectionData?.id) {
      // Cache default data
      await redis.setex(cacheKeys.keyStatistics, CACHE_TTL, defaultData)
      return NextResponse.json(defaultData)
    }

    // Fetch items
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('key_statistics_items_about_page')
      .select('*')
      .eq('statistics_id', sectionData.id)
      .order('order', { ascending: true })

    // Fetch images
    const { data: imagesData, error: imagesError } = await supabaseAdmin
      .from('key_statistics_images_about_page')
      .select('*')
      .eq('statistics_id', sectionData.id)
      .order('order', { ascending: true })

    const responseData = {
      id: sectionData.id,
      title: sectionData.title,
      description: sectionData.description,
      items: itemsData || [],
      images: imagesData || [],
    }

    // Cache the result
    await redis.setex(cacheKeys.keyStatistics, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching key statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch key statistics' },
      { status: 500 }
    )
  }
}
