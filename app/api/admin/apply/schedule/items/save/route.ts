import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    const { data: existingSchedule, error: fetchError } = await supabase
      .from('apply_page_enrollment_schedule')
      .select('id')
      .eq('is_active', true)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching schedule:', fetchError)
      throw fetchError
    }

    if (!existingSchedule) {
      console.error('Schedule not found - creating default schedule')
      const { data: newSchedule, error: insertError } = await supabase
        .from('apply_page_enrollment_schedule')
        .insert([{ title: 'Enrollment Schedule', subtitle: 'A.Y. 2025–2026 (1st Semester)', is_active: true }])
        .select()
        .single()

      if (insertError) throw insertError
      if (!newSchedule) throw new Error('Failed to create schedule')

      // Continue with the new schedule
      const scheduleId = newSchedule.id

      const itemsToInsert = items.map((item: any, index: number) => ({
        schedule_id: scheduleId,
        date: item.date,
        time: item.time,
        year_level: item.yearLevel,
        section: item.section || '',
        order: index,
      }))

      if (itemsToInsert.length > 0) {
        const { data, error } = await supabase
          .from('apply_page_enrollment_schedule_items')
          .insert(itemsToInsert)
          .select()

        if (error) throw error
        return Response.json(data)
      }
      return Response.json([])
    }

    const scheduleId = existingSchedule.id

    // Delete existing items
    await supabase
      .from('apply_page_enrollment_schedule_items')
      .delete()
      .eq('schedule_id', scheduleId)

    const itemsToInsert = items.map((item: any, index: number) => ({
      schedule_id: scheduleId,
      date: item.date,
      time: item.time,
      year_level: item.yearLevel,
      section: item.section || '',
      order: index,
    }))

    if (itemsToInsert.length === 0) {
      return Response.json([])
    }

    const { data, error } = await supabase
      .from('apply_page_enrollment_schedule_items')
      .insert(itemsToInsert)
      .select()

    if (error) {
      console.error('Error inserting items:', error)
      throw error
    }
    return Response.json(data)
  } catch (error) {
    console.error('Error saving schedule items:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save schedule items'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
