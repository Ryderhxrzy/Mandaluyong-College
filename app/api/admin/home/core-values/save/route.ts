import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, background_image_url, is_active } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Check if record exists
    const { data: existingData } = await supabaseAdmin
      .from('core_values_home_page')
      .select('id')
      .single()

    if (existingData) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('core_values_home_page')
        .update({
          title,
          description,
          background_image: background_image_url || null,
          is_active: is_active !== false,
        })
        .eq('id', existingData.id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      const savedData = data?.[0]
        ? {
            id: data[0].id.toString(),
            title: data[0].title,
            description: data[0].description,
            background_image_url: data[0].background_image,
            is_active: data[0].is_active,
          }
        : null

      // Invalidate cache
      await redis.del(cacheKeys.coreValues)

      return NextResponse.json({ data: savedData })
    } else {
      // Create new record
      const { data, error } = await supabaseAdmin
        .from('core_values_home_page')
        .insert([
          {
            title,
            description,
            background_image: background_image_url || null,
            is_active: is_active !== false,
          },
        ])
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      const savedData = data?.[0]
        ? {
            id: data[0].id.toString(),
            title: data[0].title,
            description: data[0].description,
            background_image_url: data[0].background_image,
            is_active: data[0].is_active,
          }
        : null

      // Invalidate cache
      await redis.del(cacheKeys.coreValues)

      return NextResponse.json({ data: savedData })
    }
  } catch (error) {
    console.error('Error saving core values:', error)
    return NextResponse.json(
      { error: 'Failed to save core values' },
      { status: 500 }
    )
  }
}
