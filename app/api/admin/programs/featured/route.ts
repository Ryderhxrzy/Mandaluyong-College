import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Fetch featured programs
    const { data: programsData, error: programsError } = await supabaseAdmin
      .from('programs_featured_programs')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true })

    if (programsError) {
      return NextResponse.json({ error: programsError.message }, { status: 400 })
    }

    // Transform database data to match FeaturedProgramCard interface
    const cards = (programsData || []).map((program: any) => ({
      id: program.id.toString(),
      icon: program.icon,
      title: program.course_title,
      description: program.course_description,
      duration: program.course_duration,
      requiredStrand: program.course_required_strand,
      backgroundImage: program.course_image,
      status: program.status as 'available' | 'coming-soon',
      isNew: program.status === 'coming-soon',
    }))

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching featured programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}
