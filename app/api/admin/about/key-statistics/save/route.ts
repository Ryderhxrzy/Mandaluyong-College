import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface KeyStatisticsData {
  title: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const statisticsData: KeyStatisticsData = {
      title: body.title,
      description: body.description,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('key_statistics_about_page')
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
        .from('key_statistics_about_page')
        .update(statisticsData)
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
        .from('key_statistics_about_page')
        .insert([{ ...statisticsData, is_active: true }])
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating section: ${error.message}` },
          { status: 400 }
        )
      }

      sectionId = data?.[0]?.id
    }

    return NextResponse.json({
      message: 'Key statistics section saved successfully',
      data: { id: sectionId, ...statisticsData },
    })
  } catch (error) {
    console.error('Error saving key statistics:', error)
    return NextResponse.json(
      { error: 'Failed to save key statistics' },
      { status: 500 }
    )
  }
}
