import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('programs_header')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      id: null,
      title: 'Our Featured Programs',
      subtitle: 'Discover academic paths tailored for your success.',
    }

    if (!sectionData?.id) {
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: sectionData.id,
      title: sectionData.title,
      subtitle: sectionData.sub_title,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching programs header:', error)
    return NextResponse.json(
      { error: 'Failed to fetch header' },
      { status: 500 }
    )
  }
}
