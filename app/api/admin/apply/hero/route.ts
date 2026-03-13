import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('apply_page_hero_section')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching hero section:', error)
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
