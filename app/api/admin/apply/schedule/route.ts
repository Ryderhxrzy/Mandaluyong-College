import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: scheduleData, error } = await supabase
      .from('apply_page_enrollment_schedule')
      .select('*')
      .eq('is_active', true)
      .single()

    // If no schedule found, create default one
    if (error && error.code === 'PGRST116') {
      console.log('No schedule found, creating default...')
      const { data: newSchedule, error: insertError } = await supabase
        .from('apply_page_enrollment_schedule')
        .insert([{
          title: 'Enrollment Schedule',
          subtitle: 'A.Y. 2025–2026 (1st Semester)',
          is_active: true
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default schedule:', insertError)
        return Response.json({
          id: null,
          title: 'Enrollment Schedule',
          subtitle: 'A.Y. 2025–2026 (1st Semester)',
          items: [],
        })
      }

      return Response.json({
        id: newSchedule?.id,
        title: newSchedule?.title || 'Enrollment Schedule',
        subtitle: newSchedule?.subtitle || 'A.Y. 2025–2026 (1st Semester)',
        items: [],
      })
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching schedule:', error)
      throw error
    }

    if (!scheduleData) {
      return Response.json({
        id: null,
        title: 'Enrollment Schedule',
        subtitle: 'A.Y. 2025–2026 (1st Semester)',
        items: [],
      })
    }

    const { data: items } = await supabase
      .from('apply_page_enrollment_schedule_items')
      .select('*')
      .eq('schedule_id', scheduleData.id)
      .order('order', { ascending: true })

    return Response.json({
      id: scheduleData.id,
      title: scheduleData.title,
      subtitle: scheduleData.subtitle,
      items: items || [],
    })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schedule data'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
