import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.coreValuesSection)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('core_values_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      title: 'Mandaluyong College of Science and Technology',
      description: 'MCST Core Values represent the shared beliefs of the Mandaleño. These beliefs define a genuine Mandaleño through six key ideals:',
      image: '/mcst-core.jpg',
      campus_title: 'Our Campus',
      campus_description: 'A center of excellence fostering academic growth, character development, and community service in the heart of Mandaluyong.',
      items: [],
    }

    if (!sectionData?.id) {
      await redis.setex(cacheKeys.coreValuesSection, CACHE_TTL, defaultData)
      return NextResponse.json(defaultData)
    }

    // Fetch items
    const { data: itemsData } = await supabaseAdmin
      .from('core_values_items_about_page')
      .select('*')
      .eq('core_values_id', sectionData.id)
      .order('order', { ascending: true })

    const responseData = {
      id: sectionData.id,
      title: sectionData.title,
      description: sectionData.description,
      image: sectionData.image,
      campus_title: sectionData.campus_title,
      campus_description: sectionData.campus_description,
      items: itemsData || [],
    }

    // Cache the result
    await redis.setex(cacheKeys.coreValuesSection, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching core values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core values' },
      { status: 500 }
    )
  }
}
