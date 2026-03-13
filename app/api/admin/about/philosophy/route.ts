import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('philosophy_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    if (!sectionData?.id) {
      return NextResponse.json({
        title: 'Philosophy',
        description: '',
        image: '',
        image_alt: '',
      })
    }

    return NextResponse.json({
      id: sectionData.id,
      title: sectionData.title,
      description: sectionData.description,
      image: sectionData.image || '',
      image_alt: sectionData.image_alt || '',
    })
  } catch (error) {
    console.error('Error fetching philosophy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch philosophy' },
      { status: 500 }
    )
  }
}
