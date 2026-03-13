import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface CoreValueItem {
  name: string
  description: string
}

interface ItemsSaveData {
  items: CoreValueItem[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ItemsSaveData

    // Get the section ID
    const { data: section, error: sectionError } = await supabaseAdmin
      .from('core_values_about_page')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 400 }
      )
    }

    const sectionId = section.id

    // Delete all existing items for this section
    const { error: deleteError } = await supabaseAdmin
      .from('core_values_items_about_page')
      .delete()
      .eq('core_values_id', sectionId)

    if (deleteError) {
      return NextResponse.json(
        { error: `Error deleting items: ${deleteError.message}` },
        { status: 400 }
      )
    }

    // Insert new items with order
    if (body.items && body.items.length > 0) {
      const itemsToInsert = body.items.map((item, index) => ({
        core_values_id: sectionId,
        name: item.name,
        description: item.description,
        order: index,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('core_values_items_about_page')
        .insert(itemsToInsert)

      if (insertError) {
        return NextResponse.json(
          { error: `Error inserting items: ${insertError.message}` },
          { status: 400 }
        )
      }
    }

    // Invalidate Redis cache
    await redis.del(cacheKeys.coreValuesSection)

    return NextResponse.json({
      message: 'Core Values items saved successfully',
      data: { core_values_id: sectionId, items: body.items },
    })
  } catch (error) {
    console.error('Error saving core values items:', error)
    return NextResponse.json(
      { error: 'Failed to save core values items' },
      { status: 500 }
    )
  }
}
