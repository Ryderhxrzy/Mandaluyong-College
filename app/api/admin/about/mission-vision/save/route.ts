import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface MissionVisionData {
  mission: string
  vision: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const missionVisionData: MissionVisionData = {
      mission: body.mission,
      vision: body.vision,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('mission_vision_about_page')
      .select('id')
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: `Error checking existing data: ${fetchError.message}` },
        { status: 400 }
      )
    }

    let sectionId: number

    if (existing?.id) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('mission_vision_about_page')
        .update(missionVisionData)
        .eq('id', existing.id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating section: ${error.message}` },
          { status: 400 }
        )
      }

      sectionId = data?.[0]?.id
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('mission_vision_about_page')
        .insert([{ ...missionVisionData, is_active: true }])
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating section: ${error.message}` },
          { status: 400 }
        )
      }

      sectionId = data?.[0]?.id
    }

    // Invalidate Redis cache
    await redis.del(cacheKeys.missionVision)

    return NextResponse.json({
      message: 'Mission & Vision saved successfully',
      data: { id: sectionId, ...missionVisionData },
    })
  } catch (error) {
    console.error('Error saving mission vision:', error)
    return NextResponse.json(
      { error: 'Failed to save mission vision' },
      { status: 500 }
    )
  }
}
