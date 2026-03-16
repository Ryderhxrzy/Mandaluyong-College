import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId || isNaN(Number(courseId))) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_possible_careers_section')
      .select('*')
      .eq('course_id', Number(courseId))

    if (error) {
      console.error('GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Return first record or empty object
    const result = data && data.length > 0 ? data[0] : {
      id: null,
      course_id: Number(courseId),
      section_title: '',
      section_sub_title: '',
      section_description: '',
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching careers section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch careers section' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const courseId = body.course_id

    console.log('=== POST SECTION ===')
    console.log('Payload:', body)
    console.log('Course ID:', courseId)

    if (!courseId || isNaN(Number(courseId))) {
      console.error('Invalid course ID:', courseId)
      return NextResponse.json({ error: 'Invalid course ID: ' + courseId }, { status: 400 })
    }

    // Check if course exists in programs_featured_programs
    const { data: program, error: programError } = await supabaseAdmin
      .from('programs_featured_programs')
      .select('id')
      .eq('id', Number(courseId))
      .single()

    if (programError || !program) {
      console.error('Program not found:', programError)
      return NextResponse.json({ error: 'Program ID does not exist: ' + courseId }, { status: 400 })
    }

    console.log('Program exists:', program)

    console.log('Attempting INSERT...')
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('course_possible_careers_section')
      .insert({
        course_id: Number(courseId),
        section_title: body.section_title,
        section_sub_title: body.section_sub_title,
        section_description: body.section_description,
      })
      .select()

    console.log('Insert response:', { data: insertData, error: insertError })

    // If insert succeeded, return the new record
    if (!insertError && insertData && insertData.length > 0) {
      console.log('Insert success')
      // Invalidate cache
      const cacheKey = cacheKeys.courseCareerSection(String(courseId))
      try {
        await redis.del(cacheKey)
        console.log(`Cache invalidated for career-section:${courseId}`)
      } catch (cacheError) {
        console.log('Cache invalidation error:', cacheError)
      }
      return NextResponse.json(insertData[0], { status: 201 })
    }

    // If insert failed due to duplicate key, update the existing record
    if (insertError && (insertError.code === '23505' || insertError.message.includes('duplicate'))) {
      console.log('Record already exists, updating instead...')
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('course_possible_careers_section')
        .update({
          section_title: body.section_title,
          section_sub_title: body.section_sub_title,
          section_description: body.section_description,
        })
        .eq('course_id', Number(courseId))
        .select()

      console.log('Update response:', { data: updateData, error: updateError })

      if (updateError) {
        console.error('Update failed:', updateError)
        return NextResponse.json({ error: 'Update failed: ' + updateError.message }, { status: 400 })
      }

      if (updateData && updateData.length > 0) {
        console.log('Update success')
        // Invalidate cache
        const cacheKey = cacheKeys.courseCareerSection(String(courseId))
        try {
          await redis.del(cacheKey)
          console.log(`Cache invalidated for career-section:${courseId}`)
        } catch (cacheError) {
          console.log('Cache invalidation error:', cacheError)
        }
        return NextResponse.json(updateData[0])
      }

      console.error('No data returned from update')
      return NextResponse.json({ error: 'Update failed: no data returned' }, { status: 400 })
    }

    // Any other error
    console.error('Insert failed:', insertError)
    return NextResponse.json({ error: insertError?.message || 'Failed to save record' }, { status: 400 })
  } catch (error) {
    console.error('Error saving careers section:', error)
    return NextResponse.json(
      { error: 'Failed to save careers section: ' + String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const courseId = body.course_id

    if (!courseId || isNaN(Number(courseId))) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_possible_careers_section')
      .update({
        section_title: body.section_title,
        section_sub_title: body.section_sub_title,
        section_description: body.section_description,
      })
      .eq('course_id', Number(courseId))
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No record updated' }, { status: 400 })
    }

    // Invalidate cache
    const cacheKey = cacheKeys.courseCareerSection(String(courseId))
    try {
      await redis.del(cacheKey)
      console.log(`Cache invalidated for career-section:${courseId}`)
    } catch (cacheError) {
      console.log('Cache invalidation error:', cacheError)
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating careers section:', error)
    return NextResponse.json(
      { error: 'Failed to update careers section: ' + String(error) },
      { status: 500 }
    )
  }
}
