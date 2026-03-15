import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { title, subtitle } = await req.json()

    if (!title || !subtitle) {
      return NextResponse.json(
        { error: 'Title and subtitle are required' },
        { status: 400 }
      )
    }

    // Check if CTA record exists
    const { data: existing } = await supabaseAdmin
      .from('programs_cta_section')
      .select('id')
      .limit(1)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('programs_cta_section')
        .update({
          title,
          description: subtitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      console.log('CTA updated:', data)
      return NextResponse.json({ message: 'CTA updated successfully!', data })
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('programs_cta_section')
        .insert([
          {
            title,
            description: subtitle,
          },
        ])
        .select()
        .single()

      if (error) throw error
      console.log('CTA created:', data)
      return NextResponse.json({ message: 'CTA created successfully!', data })
    }
  } catch (error) {
    console.error('Error saving CTA:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save CTA'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
