import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface JoinCommunityData {
  title: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sectionData: JoinCommunityData = {
      title: body.title,
      description: body.description,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('join_community_about_page')
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
        .from('join_community_about_page')
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
        .from('join_community_about_page')
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

    return NextResponse.json({
      message: 'Join Community section saved successfully',
      data: { id: sectionId, ...sectionData },
    })
  } catch (error) {
    console.error('Error saving join community:', error)
    return NextResponse.json(
      { error: 'Failed to save join community' },
      { status: 500 }
    )
  }
}
