import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const {
      id,
      icon,
      course_title,
      course_code,
      course_description,
      course_image,
      course_duration,
      course_required_strand,
      status,
      order,
    } = await request.json()

    if (!course_title || !course_description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Check if updating existing or creating new
    if (id) {
      // Update existing program
      const { data, error } = await supabaseAdmin
        .from('programs_featured_programs')
        .update({
          icon,
          course_title,
          course_code,
          course_description,
          course_image,
          course_duration,
          course_required_strand,
          status,
          order,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      console.log('Program updated:', data)
      return NextResponse.json({
        message: 'Program updated successfully!',
        data,
      })
    } else {
      // Insert new program
      const { data, error } = await supabaseAdmin
        .from('programs_featured_programs')
        .insert([
          {
            icon,
            course_title,
            course_code,
            course_description,
            course_image,
            course_duration,
            course_required_strand,
            status: status || 'active',
            order: order || 0,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (error) throw error
      console.log('Program created:', data)
      return NextResponse.json({
        message: 'Program created successfully!',
        data,
      })
    }
  } catch (error) {
    console.error('Error saving program:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save program'
    console.error('Full error details:', JSON.stringify(error, null, 2))
    return NextResponse.json({
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
