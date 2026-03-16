import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; careerId: string }> | { programId: string; careerId: string } }
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

    const { career_title, career_description } = await request.json()
    const numericProgramId = parseInt(programId)

    if (isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_possible_careers')
      .insert([
        {
          course_id: numericProgramId,
          career_title,
          career_description,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Invalidate cache
    const cacheKey = cacheKeys.courseCareers(programId)
    try {
      await redis.del(cacheKey)
      console.log(`Cache invalidated for careers:${programId}`)
    } catch (cacheError) {
      console.log('Cache invalidation error:', cacheError)
    }

    return NextResponse.json({ message: 'Career added successfully', data })
  } catch (error) {
    console.error('Error adding career:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add career'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; careerId: string }> | { programId: string; careerId: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let programId: string, careerId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      programId = resolvedParams.programId
      careerId = resolvedParams.careerId
    } else {
      programId = params.programId
      careerId = params.careerId
    }

    console.log('PUT request:', { programId, careerId })

    const { career_title, career_description } = await request.json()
    const numericCareerId = parseInt(careerId)
    const numericProgramId = parseInt(programId)

    if (isNaN(numericCareerId) || isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('course_possible_careers')
      .update({
        career_title,
        career_description,
      })
      .eq('id', numericCareerId)
      .eq('course_id', numericProgramId)
      .select()
      .single()

    if (error) throw error

    // Invalidate cache
    const cacheKey = cacheKeys.courseCareers(programId)
    try {
      await redis.del(cacheKey)
      console.log(`Cache invalidated for careers:${programId}`)
    } catch (cacheError) {
      console.log('Cache invalidation error:', cacheError)
    }

    return NextResponse.json({ message: 'Career updated successfully', data })
  } catch (error) {
    console.error('Error updating career:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update career'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; careerId: string }> | { programId: string; careerId: string } }
) {
  try {
    // Handle both Promise and non-Promise params
    let programId: string, careerId: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      programId = resolvedParams.programId
      careerId = resolvedParams.careerId
    } else {
      programId = params.programId
      careerId = params.careerId
    }

    console.log('DELETE request:', { programId, careerId })

    const numericCareerId = parseInt(careerId)
    const numericProgramId = parseInt(programId)

    if (isNaN(numericCareerId) || isNaN(numericProgramId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('course_possible_careers')
      .delete()
      .eq('id', numericCareerId)
      .eq('course_id', numericProgramId)

    if (error) throw error

    // Invalidate cache
    const cacheKey = cacheKeys.courseCareers(programId)
    try {
      await redis.del(cacheKey)
      console.log(`Cache invalidated for careers:${programId}`)
    } catch (cacheError) {
      console.log('Cache invalidation error:', cacheError)
    }

    return NextResponse.json({ message: 'Career deleted successfully' })
  } catch (error) {
    console.error('Error deleting career:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete career'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
