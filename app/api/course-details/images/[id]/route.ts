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

    // Fetch ALL course images for this course_id
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('course_details_images')
      .select('image')
      .eq('course_id', numericCourseId)
      .order('id', { ascending: true })

    if (imagesError) {
      console.log('Error fetching images for course_id:', numericCourseId, imagesError)
      // Return empty array if error
      return NextResponse.json([])
    }

    if (!images || images.length === 0) {
      console.log('No images found for course_id:', numericCourseId)
      return NextResponse.json([])
    }

    // Extract image URLs from the array of objects
    const imageUrls = images.map((img) => img.image)
    console.log(`Found ${imageUrls.length} images for course_id ${numericCourseId}:`, imageUrls)
    return NextResponse.json(imageUrls)
  } catch (error) {
    console.error('Error fetching course images:', error)
    // Return empty array on error
    return NextResponse.json([])
  }
}
