import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, is_active } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Check if record exists
    const { data: existingData } = await supabaseAdmin
      .from('cta_section_home_page')
      .select('id')
      .limit(1)
      .maybeSingle()

    let result
    if (existingData) {
      result = await supabaseAdmin
        .from('cta_section_home_page')
        .update({
          title,
          description,
          is_active: is_active !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single()
    } else {
      result = await supabaseAdmin
        .from('cta_section_home_page')
        .insert([
          {
            title,
            description,
            is_active: is_active !== false
          },
        ])
        .select()
        .single()
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    // Invalidate cache if you have one for CTA
    // await redis.del(cacheKeys.cta)

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error saving CTA section:', error)
    return NextResponse.json(
      { error: 'Failed to save CTA section' },
      { status: 500 }
    )
  }
}
