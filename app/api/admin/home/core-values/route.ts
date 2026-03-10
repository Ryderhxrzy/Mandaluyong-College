import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('core_values_home_page')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data: data
        ? {
            id: data.id.toString(),
            title: data.title,
            description: data.description,
            background_image_url: data.background_image,
            is_active: data.is_active,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching core values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core values' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, background_image_url, is_active } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Check if record exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('core_values_home_page')
      .select('id')
      .single()

    let result

    if (existing && !fetchError) {
      // Update existing record
      result = await supabaseAdmin
        .from('core_values_home_page')
        .update({
          title,
          description,
          background_image: background_image_url,
          is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Insert new record
      result = await supabaseAdmin
        .from('core_values_home_page')
        .insert([
          {
            title,
            description,
            background_image: background_image_url,
            is_active,
          },
        ])
        .select()
        .single()
    }

    if (result.error) {
      console.error('Database error:', result.error)
      return NextResponse.json(
        { error: 'Failed to save core values' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        id: result.data.id.toString(),
        title: result.data.title,
        description: result.data.description,
        background_image_url: result.data.background_image,
        is_active: result.data.is_active,
      },
    })
  } catch (error) {
    console.error('Error saving core values:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
