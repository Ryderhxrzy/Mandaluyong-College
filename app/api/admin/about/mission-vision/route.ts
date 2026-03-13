import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('mission_vision_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    if (!sectionData?.id) {
      return NextResponse.json({
        mission: 'To cultivate a culture of excellence in Science and Technology pursuing the improvement of the quality of life of every Mandaleño to bring about the city\'s sustainable development and resiliency towards nation building.',
        vision: 'A college of distinction in Science and Technology committed to produce high caliber and employable graduates.',
      })
    }

    return NextResponse.json({
      id: sectionData.id,
      mission: sectionData.mission,
      vision: sectionData.vision,
    })
  } catch (error) {
    console.error('Error fetching mission vision:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission vision' },
      { status: 500 }
    )
  }
}
