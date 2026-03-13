import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, description, logo_image } = body

    // Get existing record to update
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('apply_page_hero_section')
      .select('id')
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: `Error checking existing data: ${fetchError.message}` },
        { status: 400 }
      )
    }

    let result

    if (existing?.id) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('apply_page_hero_section')
        .update({
          title,
          subtitle,
          description,
          logo_image,
          updated_at: new Date().toISOString(),
        })
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
      // Create new record
      const { data, error } = await supabaseAdmin
        .from('apply_page_hero_section')
        .insert({
          title,
          subtitle,
          description,
          logo_image,
          is_active: true,
        })
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating hero section: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

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
