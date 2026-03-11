import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

interface HeroSectionData {
  title: string
  subtitle: string
  description: string
  background_image: string
  is_active: boolean
}

export async function GET() {
  try {
    // Try to get from cache first
    const cached = await redis.get(cacheKeys.hero)
    if (cached) {
      return NextResponse.json({
        message: 'Hero section fetched successfully',
        data: cached,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('hero_section_home_page')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found
      return NextResponse.json(
        { error: `Error fetching hero section: ${error.message}` },
        { status: 400 }
      )
    }

    if (!data) {
      return NextResponse.json({
        message: 'No hero section found',
        data: null,
      })
    }

    const heroData = {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      background_image_url: data.background_image,
      is_active: data.is_active,
    }

    // Store in cache
    await redis.setex(cacheKeys.hero, CACHE_TTL, heroData)

    return NextResponse.json({
      message: 'Hero section fetched successfully',
      data: heroData,
    })
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const heroData: HeroSectionData = {
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      background_image: body.background_image_url,
      is_active: body.is_active,
    }

    // Check if hero section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('hero_section_home_page')
      .select('id')
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected for new data
      return NextResponse.json(
        { error: `Error checking existing data: ${fetchError.message}` },
        { status: 400 }
      )
    }

    let result

    if (existing?.id) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('hero_section_home_page')
        .update(heroData)
        .eq('id', existing.id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating hero section: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('hero_section_home_page')
        .insert([heroData])
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating hero section: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    // Invalidate cache
    await redis.del(cacheKeys.hero)

    return NextResponse.json({
      message: 'Hero section saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving hero section:', error)
    return NextResponse.json(
      { error: 'Failed to save hero section' },
      { status: 500 }
    )
  }
}
