import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, 
      section_title, 
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

    // Validate required fields
    if (!icon || !icon_title) {
      return NextResponse.json(
        { error: 'Icon and Icon Title are required' },
        { status: 400 }
      )
    }

    const payload = {
      title: section_title || 'Institutional Overview',
      icon,
      icon_color,
      icon_bg_color_light,
      icon_bg_color_dark,
      icon_title,
      icon_title_color,
      value,
      order: order || 0,
      is_active: is_active !== false,
      updated_at: new Date().toISOString(),
    }

    if (id) {
      const { data, error } = await supabaseAdmin
        .from('institutional_overview_home_page')
        .update(payload)
        .eq('id', id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      await redis.del(cacheKeys.overview)
      return NextResponse.json({ data: data?.[0] || null })
    } else {
      const { data, error } = await supabaseAdmin
        .from('institutional_overview_home_page')
        .insert([payload])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      await redis.del(cacheKeys.overview)
      return NextResponse.json({ data: data?.[0] || null })
    }
  } catch (error) {
    console.error('Error saving overview item:', error)
    return NextResponse.json(
      { error: 'Failed to save overview item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('institutional_overview_home_page')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    await redis.del(cacheKeys.overview)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting overview item:', error)
    return NextResponse.json(
      { error: 'Failed to delete overview item' },
      { status: 500 }
    )
  }
}
