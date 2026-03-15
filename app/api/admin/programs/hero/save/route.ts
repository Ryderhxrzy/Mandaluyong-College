import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Check if hero record exists
    const { data: existing } = await supabaseAdmin
      .from('programs_hero_section')
      .select('id')
      .limit(1)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('programs_hero_section')
        .update({
          background_image: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      console.log('Hero updated:', data)
      return NextResponse.json({ message: 'Hero updated successfully!', data })
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('programs_hero_section')
        .insert([
          {
            background_image: imageUrl,
          },
        ])
        .select()
        .single()

      if (error) throw error
      console.log('Hero created:', data)
      return NextResponse.json({ message: 'Hero created successfully!', data })
    }
  } catch (error) {
    console.error('Error saving hero:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save hero'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
