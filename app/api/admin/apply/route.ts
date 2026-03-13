import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('apply_page')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching apply page:', error)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching apply page:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, enrollment_period, enrollment_dates } = body

    // Get existing record to update
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('apply_page')
      .select('id')
      .eq('is_active', true)
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
        .from('apply_page')
        .update({
          title,
          enrollment_period,
          enrollment_dates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating apply page: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Create new record
      const { data, error } = await supabaseAdmin
        .from('apply_page')
        .insert({
          title,
          enrollment_period,
          enrollment_dates,
          is_active: true,
        })
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating apply page: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    return NextResponse.json({
      message: 'Apply page saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving apply page:', error)
    return NextResponse.json(
      { error: 'Failed to save apply page' },
      { status: 500 }
    )
  }
}
