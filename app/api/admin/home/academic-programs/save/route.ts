import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, section_title, image, order, is_active, course_name } = body

    // Validate required fields
    if (!course_name) {
      return NextResponse.json(
        { error: 'Course name is required' },
        { status: 400 }
      )
    }

    // Check if order already exists (excluding current program if updating)
    const { data: existingOrder } = await supabaseAdmin
      .from('academic_programs_home_page')
      .select('id')
      .eq('order', order || 0)
      .neq('id', id || 0)
      .single()

    if (existingOrder) {
      return NextResponse.json(
        { error: 'This order number is already taken. Please use a different order number.' },
        { status: 400 }
      )
    }

    if (id) {
      // Update existing program
      const { data, error } = await supabaseAdmin
        .from('academic_programs_home_page')
        .update({
          title: section_title || 'Our Programs',
          image: image || null,
          order: order || 0,
          is_active: is_active !== false,
          course_name: course_name || null,
        })
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ data: data?.[0] || null })
    } else {
      // Create new program
      const { data, error } = await supabaseAdmin
        .from('academic_programs_home_page')
        .insert([
          {
            title: section_title || 'Our Programs',
            image: image || null,
            order: order || 0,
            is_active: is_active !== false,
            course_name: course_name || null,
          },
        ])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ data: data?.[0] || null })
    }
  } catch (error) {
    console.error('Error saving academic program:', error)
    return NextResponse.json(
      { error: 'Failed to save academic program' },
      { status: 500 }
    )
  }
}
