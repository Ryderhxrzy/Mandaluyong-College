import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface CoreValuesSectionData {
  title: string
  description: string
  image: string
  campus_title: string
  campus_description: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sectionData: CoreValuesSectionData = {
      title: body.title,
      description: body.description,
      image: body.image,
      campus_title: body.campus_title,
      campus_description: body.campus_description,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('core_values_about_page')
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
        .from('core_values_about_page')
        .update(sectionData)
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
        .from('core_values_about_page')
        .insert([{ ...sectionData, is_active: true }])
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
    await redis.del(cacheKeys.coreValuesSection)

    return NextResponse.json({
      message: 'Core Values section saved successfully',
      data: { id: sectionId, ...sectionData },
    })
  } catch (error) {
    console.error('Error saving core values:', error)
    return NextResponse.json(
      { error: 'Failed to save core values' },
      { status: 500 }
    )
  }
}
