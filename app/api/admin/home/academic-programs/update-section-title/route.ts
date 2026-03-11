import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys } from '@/lib/redis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { section_title } = body

    // Validate required fields
    if (!section_title || !section_title.trim()) {
      return NextResponse.json(
        { error: 'Section title is required' },
        { status: 400 }
      )
    }

    // Update all programs' title column with the new section title
    const { error } = await supabaseAdmin
      .from('academic_programs_home_page')
      .update({
        title: section_title.trim(),
      })
      .neq('id', 0) // Update all rows

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(cacheKeys.academicPrograms)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating section title:', error)
    return NextResponse.json(
      { error: 'Failed to update section title' },
      { status: 500 }
    )
  }
}
