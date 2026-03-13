import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface StatItem {
  id: string
  value: string
  label: string
}

interface StatImage {
  id: string
  image: string
  altText: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, images } = body

    // Get the section ID first
    const { data: section, error: sectionError } = await supabaseAdmin
      .from('key_statistics_about_page')
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
        .from('key_statistics_items_about_page')
        .delete()
        .eq('statistics_id', sectionId)

      if (deleteItemsError) {
        return NextResponse.json(
          { error: `Error deleting items: ${deleteItemsError.message}` },
          { status: 400 }
        )
      }

      // Insert new items
      const itemsData = items.map((item: StatItem, index: number) => ({
        statistics_id: sectionId,
        value: item.value,
        label: item.label,
        order: index + 1,
      }))

      const { error: insertItemsError } = await supabaseAdmin
        .from('key_statistics_items_about_page')
        .insert(itemsData)

      if (insertItemsError) {
        return NextResponse.json(
          { error: `Error saving items: ${insertItemsError.message}` },
          { status: 400 }
        )
      }
    }

    // Save images
    if (images && images.length > 0) {
      // Delete existing images
      const { error: deleteImagesError } = await supabaseAdmin
        .from('key_statistics_images_about_page')
        .delete()
        .eq('statistics_id', sectionId)

      if (deleteImagesError) {
        return NextResponse.json(
          { error: `Error deleting images: ${deleteImagesError.message}` },
          { status: 400 }
        )
      }

      // Insert new images
      const imagesData = images.map((img: StatImage, index: number) => ({
        statistics_id: sectionId,
        image: img.image,
        alt_text: img.altText,
        order: index + 1,
      }))

      const { error: insertImagesError } = await supabaseAdmin
        .from('key_statistics_images_about_page')
        .insert(imagesData)

      if (insertImagesError) {
        return NextResponse.json(
          { error: `Error saving images: ${insertImagesError.message}` },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      message: 'Content saved successfully',
      data: { itemsCount: items.length, imagesCount: images.length },
    })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}
