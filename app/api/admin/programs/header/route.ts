import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data - try to get active first, then any record
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('programs_header')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      console.error('Supabase error:', sectionError)
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    const defaultData = {
      id: null,
      title: 'Our Featured Programs',
      subtitle: 'Discover academic paths tailored for your success.',
    }

    if (!sectionData?.id) {
      console.log('No header data found in database, returning defaults')
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: sectionData.id.toString(),
      title: sectionData.title || 'Our Featured Programs',
      subtitle: sectionData.sub_title || 'Discover academic paths tailored for your success.',
    }

    console.log('Header fetched from database:', responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching programs header:', error)
    return NextResponse.json(
      { error: 'Failed to fetch header' },
      { status: 500 }
    )
  }
}
