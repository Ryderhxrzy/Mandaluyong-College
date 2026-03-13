import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface PhilosophyData {
  title: string
  description: string
  image: string
  image_alt: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const philosophyData: PhilosophyData = {
      title: body.title,
      description: body.description,
      image: body.image,
      image_alt: body.image_alt,
    }

    // Check if section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('philosophy_about_page')
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
        .from('philosophy_about_page')
        .update(philosophyData)
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
        .from('philosophy_about_page')
        .insert([{ ...philosophyData, is_active: true }])
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
      message: 'Philosophy section saved successfully',
      data: { id: sectionId, ...philosophyData },
    })
  } catch (error) {
    console.error('Error saving philosophy:', error)
    return NextResponse.json(
      { error: 'Failed to save philosophy' },
      { status: 500 }
    )
  }
}
