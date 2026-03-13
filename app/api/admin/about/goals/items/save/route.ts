import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface GoalItem {
  id: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    // Get the section ID first
    const { data: section, error: sectionError } = await supabaseAdmin
      .from('goals_about_page')
      .select('id')
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: `Error fetching section: ${sectionError.message}` },
        { status: 400 }
      )
    }

    if (!section?.id) {
      return NextResponse.json(
        { error: 'Section not found. Please save the section header first.' },
        { status: 400 }
      )
    }

    const sectionId = section.id

    // Save items
    if (items && items.length > 0) {
      // Delete existing items
      const { error: deleteItemsError } = await supabaseAdmin
        .from('goals_items_about_page')
        .delete()
        .eq('goals_id', sectionId)

      if (deleteItemsError) {
        return NextResponse.json(
          { error: `Error deleting items: ${deleteItemsError.message}` },
          { status: 400 }
        )
      }

      // Insert new items
      const itemsData = items.map((item: GoalItem, index: number) => ({
        goals_id: sectionId,
        description: item.description,
        order: index + 1,
      }))

      const { error: insertItemsError } = await supabaseAdmin
        .from('goals_items_about_page')
        .insert(itemsData)

      if (insertItemsError) {
        return NextResponse.json(
          { error: `Error saving items: ${insertItemsError.message}` },
          { status: 400 }
        )
      }
    }

    // Invalidate Redis cache
    await redis.del(cacheKeys.goals)

    return NextResponse.json({
      message: 'Goals items saved successfully',
      data: { itemsCount: items.length },
    })
  } catch (error) {
    console.error('Error saving goals items:', error)
    return NextResponse.json(
      { error: 'Failed to save goals items' },
      { status: 500 }
    )
  }
}
