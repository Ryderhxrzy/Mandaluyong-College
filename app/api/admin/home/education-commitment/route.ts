import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('quality_education_commitment_home_page')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching education commitment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education commitment' },
      { status: 500 }
    )
  }
}
