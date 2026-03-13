import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface GoalsData {
  title: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const goalsData: GoalsData = {
      title: body.title,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('goals_about_page')
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
        .from('goals_about_page')
        .update(goalsData)
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
        .from('goals_about_page')
        .insert([{ ...goalsData, is_active: true }])
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
    await redis.del(cacheKeys.goals)

    return NextResponse.json({
      message: 'Goals section saved successfully',
      data: { id: sectionId, ...goalsData },
    })
  } catch (error) {
    console.error('Error saving goals:', error)
    return NextResponse.json(
      { error: 'Failed to save goals' },
      { status: 500 }
    )
  }
}
