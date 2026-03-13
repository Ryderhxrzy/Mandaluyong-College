import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('goals_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    if (!sectionData?.id) {
      return NextResponse.json({
        title: 'Goals',
        items: [],
      })
    }

    // Fetch items
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from('goals_items_about_page')
      .select('*')
      .eq('goals_id', sectionData.id)
      .order('order', { ascending: true })

    return NextResponse.json({
      id: sectionData.id,
      title: sectionData.title,
      items: itemsData || [],
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}
