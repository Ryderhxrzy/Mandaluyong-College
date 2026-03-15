import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('programs_featured_programs')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('Program deleted:', data)
    return NextResponse.json({
      message: 'Program deleted successfully!',
      data,
    })
  } catch (error) {
    console.error('Error deleting program:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete program'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
