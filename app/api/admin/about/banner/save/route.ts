import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface BannerData {
  background_image: string
  is_active: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const bannerData: BannerData = {
      background_image: body.background_image,
      is_active: true,
    }

    // Check if banner section exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('banner_about_page')
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
        .from('banner_about_page')
        .update(bannerData)
        .eq('id', existing.id)
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error updating banner: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('banner_about_page')
        .insert([bannerData])
        .select()

      if (error) {
        return NextResponse.json(
          { error: `Error creating banner: ${error.message}` },
          { status: 400 }
        )
      }

      result = data?.[0]
    }

    return NextResponse.json({
      message: 'Banner saved successfully',
      data: result,
    })
  } catch (error) {
    console.error('Error saving banner:', error)
    return NextResponse.json(
      { error: 'Failed to save banner' },
      { status: 500 }
    )
  }
}
