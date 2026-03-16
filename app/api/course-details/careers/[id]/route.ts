import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    console.log('=== Careers API ===')
    console.log('Params type:', params instanceof Promise ? 'Promise' : 'Object')

    // Handle both Promise and non-Promise params
    let courseId: string
    if (params instanceof Promise) {
      console.log('Awaiting params...')
      const resolvedParams = await params
      courseId = resolvedParams.id
    } else {
      courseId = params.id
    }

    console.log('Raw courseId:', courseId, 'Type:', typeof courseId)

    const numericCourseId = parseInt(courseId)
    console.log('Numeric courseId:', numericCourseId, 'IsNaN:', isNaN(numericCourseId))

    if (isNaN(numericCourseId)) {
      console.error('Invalid courseId - not a number')
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const cacheKey = cacheKeys.courseCareers(courseId)

    // Try to get from cache first
    try {
      const cachedCareers = await redis.get(cacheKey)
      if (cachedCareers) {
        console.log(`Cache hit for careers:${courseId}`)
        return NextResponse.json(cachedCareers)
      }
    } catch (cacheError) {
      console.log('Cache read error (continuing without cache):', cacheError)
    }

    // Fetch course possible careers
    console.log('Querying course_possible_careers for course_id:', numericCourseId)
    const { data: careers, error: careersError } = await supabaseAdmin
      .from('course_possible_careers')
      .select('id, career_title, career_description')
      .eq('course_id', numericCourseId)
      .order('order_number', { ascending: true })

    console.log('Query result:', { careersError, dataLength: careers?.length })

    if (careersError) {
      console.error('Careers database error:', careersError.message, careersError.code)
      return NextResponse.json({
        error: careersError.message,
        code: careersError.code
      }, { status: 400 })
    }

    const result = careers || []

    // Store in cache
    try {
      await redis.setex(cacheKey, CACHE_TTL, result)
    } catch (cacheError) {
      console.log('Cache write error:', cacheError)
    }

    console.log('Returning', result.length, 'careers')
    return NextResponse.json(result)
  } catch (error) {
    console.error('=== Catch Error ===')
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Full error:', error)

    return NextResponse.json({
      error: 'Failed to fetch careers',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
