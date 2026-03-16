import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> | { programId: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let programId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      programId = resolvedParams.programId
    } else {
      programId = params.programId
    }

    const { semester_id, course_code, course_title, units } = await request.json()
    const numericProgramId = parseInt(programId)

    if (isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_curriculum')
      .insert([
        {
          course_id: numericProgramId,
          semester_id,
          course_code,
          course_title,
          units,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Invalidate cache
    const cacheKey = cacheKeys.courseCurriculum(programId)
    try {
      await redis.del(cacheKey)
      console.log(`Cache invalidated for curriculum:${programId}`)
    } catch (cacheError) {
      console.log('Cache invalidation error:', cacheError)
    }

    return NextResponse.json({ message: 'Course added successfully', data })
  } catch (error) {
    console.error('Error adding course:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add course'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
