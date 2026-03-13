import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, apply_page_id, step_number, description, order } = body

    let result

    if (id) {
      // Update existing procedure step
      const { data, error } = await supabaseAdmin
        .from('apply_page_enrollment_procedure')
        .update({
          step_number,
          description,
          order,
        })
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating procedure: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Create new procedure step
      const { data, error } = await supabaseAdmin
        .from('apply_page_enrollment_procedure')
        .insert({
          apply_page_id,
          step_number,
          description,
          order,
        })
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating procedure: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    return NextResponse.json({
      message: 'Procedure step saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving procedure:', error)
    return NextResponse.json(
      { error: 'Failed to save procedure' },
      { status: 500 }
    )
  }
}
