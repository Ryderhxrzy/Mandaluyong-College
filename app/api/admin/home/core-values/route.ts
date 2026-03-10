import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('core_values_home_page')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching core values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core values' },
      { status: 500 }
    )
  }
}
