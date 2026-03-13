import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

interface ImageData {
  image: string
  altText: string
}

interface ImagesSaveData {
  images: ImageData[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ImagesSaveData

    // Get the section ID
    const { data: section, error: sectionError } = await supabaseAdmin
      .from('join_community_about_page')
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

    // Delete all existing images for this section
    const { error: deleteError } = await supabaseAdmin
      .from('join_community_images_about_page')
      .delete()
      .eq('join_community_id', sectionId)

    if (deleteError) {
      return NextResponse.json(
        { error: `Error deleting images: ${deleteError.message}` },
        { status: 400 }
      )
    }

    // Insert new images with order
    if (body.images && body.images.length > 0) {
      const imagesToInsert = body.images.map((image, index) => ({
        join_community_id: sectionId,
        image: image.image,
        alt_text: image.altText,
        order: index,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('join_community_images_about_page')
        .insert(imagesToInsert)

      if (insertError) {
        return NextResponse.json(
          { error: `Error inserting images: ${insertError.message}` },
          { status: 400 }
        )
      }
    }

    // Invalidate Redis cache
    await redis.del(cacheKeys.joinCommunity)

    return NextResponse.json({
      message: 'Join Community images saved successfully',
      data: { join_community_id: sectionId, images: body.images },
    })
  } catch (error) {
    console.error('Error saving join community images:', error)
    return NextResponse.json(
      { error: 'Failed to save join community images' },
      { status: 500 }
    )
  }
}
