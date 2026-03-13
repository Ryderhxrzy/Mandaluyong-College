import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('apply_page_requirements')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching requirements:', error)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching requirements:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    const { error } = await supabaseAdmin
      .from('apply_page_requirements')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: `Error deleting requirement: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting requirement:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
