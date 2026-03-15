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

    console.log('Fetching curriculum for courseId:', courseId)

    const numericCourseId = parseInt(courseId)
    if (isNaN(numericCourseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    // Fetch curriculum years
    const { data: years, error: yearsError } = await supabaseAdmin
      .from('curriculum_years')
      .select('*')
      .order('order_number', { ascending: true })

    if (yearsError) {
      console.error('Years error:', yearsError)
      return NextResponse.json({ error: yearsError.message }, { status: 400 })
    }

    // Fetch curriculum data with nested structure
    const curriculumData = []

    for (const year of years || []) {
      // Fetch semesters for this year
      const { data: semesters, error: semestersError } = await supabaseAdmin
        .from('curriculum_semesters')
        .select('*')
        .eq('year_id', year.id)
        .order('order_number', { ascending: true })

      if (semestersError) {
        console.error('Semesters error:', semestersError)
        continue
      }

      const semesterData = []

      for (const semester of semesters || []) {
        // Fetch courses for this semester
        console.log(`Fetching courses for semester ${semester.id} (${semester.name}) and course_id ${numericCourseId}`)

        const { data: courses, error: coursesError } = await supabaseAdmin
          .from('course_curriculum')
          .select('*')
          .eq('semester_id', semester.id)
          .eq('course_id', numericCourseId)
          .order('course_code', { ascending: true })

        console.log(`Semester ${semester.name} - Courses found:`, courses?.length || 0)
        console.log(`Courses data:`, courses)

        if (coursesError) {
          console.error(`Courses error for semester ${semester.id}:`, coursesError)
          continue
        }

        semesterData.push({
          ...semester,
          courses: courses || [],
        })
      }

      curriculumData.push({
        ...year,
        semesters: semesterData,
      })
    }

    console.log('Curriculum data fetched successfully, total years:', curriculumData.length)
    return NextResponse.json(curriculumData)
  } catch (error) {
    console.error('Error fetching curriculum:', error)
    return NextResponse.json({
      error: 'Failed to fetch curriculum',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
