import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_section_home_page')
      .select('*')
      .order('order', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    )
  }
}
