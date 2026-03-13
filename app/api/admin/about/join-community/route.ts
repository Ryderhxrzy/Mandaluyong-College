import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch section data
    const { data: sectionData, error: sectionError } = await supabaseAdmin
      .from('join_community_about_page')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (sectionError && sectionError.code !== 'PGRST116') {
      return NextResponse.json({ error: sectionError.message }, { status: 400 })
    }

    if (!sectionData?.id) {
      return NextResponse.json({
        title: 'Advancing Science.\nEmpowering Mandaleños.',
        description: 'At Mandaluyong College of Science and Technology, we champion excellence in instruction, innovation, and inclusive education. Our commitment is rooted in public service, research, and producing globally competitive graduates with a strong sense of nationalism. Be part of a future-forward institution shaping the leaders of tomorrow.',
        images: [],
      })
    }

    // Fetch images
    const { data: imagesData, error: imagesError } = await supabaseAdmin
      .from('join_community_images_about_page')
      .select('*')
      .eq('join_community_id', sectionData.id)
      .order('order', { ascending: true })

    return NextResponse.json({
      id: sectionData.id,
      title: sectionData.title,
      description: sectionData.description,
      images: imagesData || [],
    })
  } catch (error) {
    console.error('Error fetching join community:', error)
    return NextResponse.json(
      { error: 'Failed to fetch join community' },
      { status: 500 }
    )
  }
}
