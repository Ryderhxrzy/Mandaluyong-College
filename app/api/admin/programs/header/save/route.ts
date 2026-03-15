import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const { title, subtitle } = await req.json()

    if (!title || !subtitle) {
      return Response.json(
        { error: 'Title and subtitle are required' },
        { status: 400 }
      )
    }

    // Check if header record exists
    const { data: existing } = await supabaseAdmin
      .from('programs_header')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabaseAdmin
        .from('programs_header')
        .update({
          title,
          sub_title: subtitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      console.log('Header updated:', data)
      return Response.json({ message: 'Header updated successfully!', data })
    } else {
      // Insert new record
      const { data, error } = await supabaseAdmin
        .from('programs_header')
        .insert([
          {
            title,
            sub_title: subtitle,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (error) throw error
      console.log('Header created:', data)
      return Response.json({ message: 'Header created successfully!', data })
    }
  } catch (error) {
    console.error('Error saving programs header:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save header'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
