import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface WhyChooseSectionData {
  title: string
  subtitle: string
  is_active: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const whyChooseData: WhyChooseSectionData = {
      title: body.title,
      subtitle: body.subtitle,
      is_active: true,
    }

    // Check if why choose section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('why_choose_about_page')
      .select('id')
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
        .from('why_choose_about_page')
        .update(whyChooseData)
        .eq('id', existing.id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating why choose section: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('why_choose_about_page')
        .insert([whyChooseData])
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating why choose section: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    // Invalidate Redis cache
    await redis.del(cacheKeys.whyChoose)

    return NextResponse.json({
      message: 'Why Choose section saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving why choose section:', error)
    return NextResponse.json(
      { error: 'Failed to save why choose section' },
      { status: 500 }
    )
  }
}
