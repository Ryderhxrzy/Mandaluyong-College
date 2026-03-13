import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { title, subtitle } = await req.json()

    const { data: existingSchedule, error: fetchError } = await supabase
      .from('apply_page_enrollment_schedule')
      .select('id')
      .eq('is_active', true)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching schedule:', fetchError)
      throw fetchError
    }

    if (existingSchedule) {
      const { data, error } = await supabase
        .from('apply_page_enrollment_schedule')
        .update({ title, subtitle, updated_at: new Date().toISOString() })
        .eq('id', existingSchedule.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating schedule:', error)
        throw error
      }
      return Response.json(data)
    } else {
      const { data, error } = await supabase
        .from('apply_page_enrollment_schedule')
        .insert([{ title, subtitle, is_active: true }])
        .select()
        .single()

      if (error) {
        console.error('Error inserting schedule:', error)
        throw error
      }
      return Response.json(data)
    }
  } catch (error) {
    console.error('Error saving schedule header:', error)

    let errorMessage = 'Failed to save schedule header'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    }

    console.error('Detailed error:', errorMessage)

    return Response.json(
      { error: `Header save failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
