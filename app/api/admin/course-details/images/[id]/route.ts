import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let courseId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      courseId = resolvedParams.id
    } else {
      courseId = params.id
    }

    const { images } = await request.json()
    const numericCourseId = parseInt(courseId)

    if (isNaN(numericCourseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    // Delete old images
    await supabaseAdmin
      .from('course_details_images')
      .delete()
      .eq('course_id', numericCourseId)

    // Insert new images
    if (images && images.length > 0) {
      const imagesToInsert = images.map((image: string) => ({
        course_id: numericCourseId,
        image,
      }))

      const { error } = await supabaseAdmin
        .from('course_details_images')
        .insert(imagesToInsert)

      if (error) throw error
    }

    return NextResponse.json({ message: 'Images updated successfully' })
  } catch (error) {
    console.error('Error updating images:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update images'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
