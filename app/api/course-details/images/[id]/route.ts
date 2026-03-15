import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Handle both Promise and non-Promise params
    let courseId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      courseId = resolvedParams.id
    } else {
      courseId = params.id
    }

    console.log('Fetching image for courseId:', courseId)

    const numericCourseId = parseInt(courseId)
    if (isNaN(numericCourseId)) {
      console.log('Invalid courseId')
      return NextResponse.json([])
    }

    // Fetch course images
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('course_details_images')
      .select('image')
      .eq('course_id', numericCourseId)
      .limit(1)
      .single()

    if (imagesError) {
      console.log('No image found for course_id:', numericCourseId)
      // Return empty array if no image found
      return NextResponse.json([])
    }

    if (!images) {
      console.log('Images data is null')
      return NextResponse.json([])
    }

    console.log('Image found:', images.image)
    return NextResponse.json([images.image])
  } catch (error) {
    console.error('Error fetching course images:', error)
    // Return empty array on error
    return NextResponse.json([])
  }
}
