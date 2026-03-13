import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, apply_page_id, description, order } = body

    let result

    if (id) {
      // Update existing requirement
      const { data, error } = await supabaseAdmin
        .from('apply_page_requirements')
        .update({
          description,
          order,
        })
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating requirement: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Create new requirement
      const { data, error } = await supabaseAdmin
        .from('apply_page_requirements')
        .insert({
          apply_page_id,
          description,
          order,
        })
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating requirement: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    return NextResponse.json({
      message: 'Requirement saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving requirement:', error)
    return NextResponse.json(
      { error: 'Failed to save requirement' },
      { status: 500 }
    )
  }
}
