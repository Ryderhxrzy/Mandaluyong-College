import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface WhyChooseCardData {
  id?: number
  why_choose_id: number
  icon: string
  title: string
  description: string
  icon_color: string
  icon_bg_color_light: string
  icon_bg_color_dark: string
  order: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get or create the why_choose section
    const { data: section, error: sectionError } = await supabaseAdmin
      .from('why_choose_about_page')
      .select('id')
      .limit(1)
      .single()

    let why_choose_id = section?.id

    if (sectionError && sectionError.code === 'PGRST116') {
      // No section exists, create one
      const { data: newSection, error: createError } = await supabaseAdmin
        .from('why_choose_about_page')
        .insert([{
          title: 'Why Choose Mandaluyong College of Science and Technology?',
          subtitle: 'Discover what sets MCST apart. We are dedicated to providing transformative education, fostering innovation, and building a community committed to public service and excellence.',
          is_active: true
        }])
        .select()

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      why_choose_id = newSection?.[0]?.id
    } else if (sectionError) {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const cardData: WhyChooseCardData = {
      why_choose_id: why_choose_id,
      icon: body.icon,
      title: body.title,
      description: body.description,
      icon_color: body.icon_color,
      icon_bg_color_light: body.icon_bg_color_light,
      icon_bg_color_dark: body.icon_bg_color_dark,
      order: body.order || 0
    }

    let result

    if (body.id) {
      // Update existing card
      const { data, error } = await supabaseAdmin
        .from('why_choose_cards_about_page')
        .update(cardData)
        .eq('id', body.id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      result = data?.[0]
    } else {
      // Insert new card
      const { data, error } = await supabaseAdmin
        .from('why_choose_cards_about_page')
        .insert([cardData])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      result = data?.[0]
    }

    return NextResponse.json({
      message: 'Card saved successfully',
      data: result
    })
  } catch (error) {
    console.error('Error saving card:', error)
    return NextResponse.json(
      { error: 'Failed to save card' },
      { status: 500 }
    )
  }
}
