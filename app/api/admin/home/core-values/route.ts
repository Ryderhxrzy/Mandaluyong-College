import { NextResponse } from 'next/server'
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

