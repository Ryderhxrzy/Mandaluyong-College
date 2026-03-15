import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    console.log('=== Fetching Program ===')
    console.log('Request URL:', request.url)

    // Handle both Promise and non-Promise params
    let id: string
    if (params instanceof Promise) {
      const resolvedParams = await params
      id = resolvedParams.id
    } else {
      id = params.id
    }

    console.log('Program ID:', id)

    if (!id) {
      console.error('No ID provided')
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    const numericId = parseInt(id)
    console.log('Numeric ID:', numericId)

    if (isNaN(numericId)) {
      console.error('ID is not a valid number:', id)
      return NextResponse.json({ error: 'Invalid program ID format' }, { status: 400 })
    }

    // Fetch program by ID
    console.log('Querying for program with id:', numericId)
    const { data: program, error: programError } = await supabaseAdmin
      .from('programs_featured_programs')
      .select('*')
      .eq('id', numericId)

    if (programError) {
      console.error('Database error:', programError)
      return NextResponse.json({ error: 'Database error', message: programError.message }, { status: 400 })
    }

    if (!program || program.length === 0) {
      console.error('No program found with id:', numericId)
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    const programData = program[0]
    console.log('Found program:', programData.course_title)

    // Transform database data to match CourseDetailsProps interface
    const transformedProgram = {
      id: programData.id.toString(),
      icon: programData.icon,
      title: programData.course_title,
      description: programData.course_description,
      duration: programData.course_duration,
      requiredStrand: programData.course_required_strand,
      backgroundImage: programData.course_image,
      status: (programData.status === 'active' ? 'available' : 'coming-soon') as 'available' | 'coming-soon',
      isNew: programData.status === 'coming-soon',
    }

    return NextResponse.json(transformedProgram)
  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({
      error: 'Failed to fetch program',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
