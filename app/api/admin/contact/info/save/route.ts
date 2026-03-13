import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { section_image } = await req.json()

    const { data: existing } = await supabase
      .from('contact_page_info')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('contact_page_info')
        .update({ section_image, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return Response.json(data)
    } else {
      const { data, error } = await supabase
        .from('contact_page_info')
        .insert([{ section_image, is_active: true }])
        .select()
        .single()

      if (error) throw error
      return Response.json(data)
    }
  } catch (error) {
    console.error('Error saving contact info:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save contact info'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
