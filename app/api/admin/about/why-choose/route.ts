import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('why_choose_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching why choose section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch why choose section' },
      { status: 500 }
    )
  }
}
