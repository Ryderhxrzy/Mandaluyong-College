import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: ctaData, error } = await supabaseAdmin
      .from('programs_cta_section')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const defaultData = {
      id: null,
      title: 'Elevate Your Future With Mandaluyong College of Science and Technology',
      subtitle: 'Whether you\'re aiming to innovate, lead, serve, or create—your journey starts here. Our programs are designed to not just prepare you for a job, but to shape you into a visionary ready to transform the world.',
    }

    if (!ctaData?.id) {
      console.log('No CTA data found, returning defaults')
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: ctaData.id.toString(),
      title: ctaData.title || defaultData.title,
      subtitle: ctaData.description || defaultData.subtitle,
    }

    console.log('CTA response:', responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching CTA:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CTA' },
      { status: 500 }
    )
  }
}
