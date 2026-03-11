import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis, cacheKeys, CACHE_TTL } from '@/lib/redis'

export async function GET() {
  try {
    // Try to get from cache first
    const cached = await redis.get(cacheKeys.academicPrograms)
    if (cached) {
      return NextResponse.json(cached)
    }

    // If not in cache, fetch from database
    const { data, error } = await supabaseAdmin
      .from('academic_programs_home_page')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Store in cache
    if (data) {
      await redis.setex(cacheKeys.academicPrograms, CACHE_TTL, data)
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching academic programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch academic programs' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('academic_programs_home_page')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Invalidate cache
    await redis.del(cacheKeys.academicPrograms)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting academic program:', error)
    return NextResponse.json(
      { error: 'Failed to delete academic program' },
      { status: 500 }
    )
  }
}
