import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; courseId: string }> | { programId: string; courseId: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let programId: string, courseId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      programId = resolvedParams.programId
      courseId = resolvedParams.courseId
    } else {
      programId = params.programId
      courseId = params.courseId
    }

    const { course_code, course_title, units } = await request.json()
    const numericCourseId = parseInt(courseId)
    const numericProgramId = parseInt(programId)

    if (isNaN(numericCourseId) || isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_curriculum')
      .update({
        course_code,
        course_title,
        units,
      })
      .eq('id', numericCourseId)
      .eq('course_id', numericProgramId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message: 'Course updated successfully', data })
  } catch (error) {
    console.error('Error updating course:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update course'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; courseId: string }> | { programId: string; courseId: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let programId: string, courseId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      programId = resolvedParams.programId
      courseId = resolvedParams.courseId
    } else {
      programId = params.programId
      courseId = params.courseId
    }

    const numericCourseId = parseInt(courseId)
    const numericProgramId = parseInt(programId)

    if (isNaN(numericCourseId) || isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('course_curriculum')
      .delete()
      .eq('id', numericCourseId)
      .eq('course_id', numericProgramId)

    if (error) throw error

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete course'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
