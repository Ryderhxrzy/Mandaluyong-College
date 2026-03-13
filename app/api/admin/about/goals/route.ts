import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Check Redis cache first
    const cachedData = await redis.get(cacheKeys.goals)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('goals_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      title: 'Goals',
      items: [],
    }

    if (!sectionData?.id) {
      // Cache default data
      await redis.setex(cacheKeys.goals, CACHE_TTL, defaultData)
      return NextResponse.json(defaultData)
    }

    // Fetch items
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('goals_items_about_page')
      .select('*')
      .eq('goals_id', sectionData.id)
      .order('order', { ascending: true })

    const responseData = {
      id: sectionData.id,
      title: sectionData.title,
      items: itemsData || [],
    }

    // Cache the result
    await redis.setex(cacheKeys.goals, CACHE_TTL, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}
