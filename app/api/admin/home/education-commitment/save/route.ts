import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, 
      section_title, 
      section_description,
      icon, 
      icon_color, 
      icon_bg_color_light, 
      icon_bg_color_dark, 
      icon_title, 
      icon_title_color, 
      value, 
      order, 
      is_active 
    } = body

    const payload = {
      title: section_title,
      description: section_description,
      icon,
      icon_color,
      icon_bg_color_light,
      icon_bg_color_dark,
      icon_title,
      icon_title_color,
      value: value || '', // This is the item content
      order: order || 0,
      is_active: is_active !== false
    }

    if (id) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from('quality_education_commitment_home_page')
        .update(payload)
        .eq('id', id)
        .select()

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ data: data?.[0] })
    } else {
      // Create new
      const { data, error } = await supabaseAdmin
        .from('quality_education_commitment_home_page')
        .insert([payload])
        .select()

      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ data: data?.[0] })
    }
  } catch (error) {
    console.error('Error saving education commitment:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const { error } = await supabaseAdmin
      .from('quality_education_commitment_home_page')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
