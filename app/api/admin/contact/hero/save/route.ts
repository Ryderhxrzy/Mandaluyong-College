import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { title, subtitle, logo_image } = await req.json()

    const { data: existing } = await supabase
      .from('contact_page_hero')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('contact_page_hero')
        .update({ title, subtitle, logo_image, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return Response.json(data)
    } else {
      const { data, error } = await supabase
        .from('contact_page_hero')
        .insert([{ title, subtitle, logo_image, is_active: true }])
        .select()
        .single()

      if (error) throw error
      return Response.json(data)
    }
  } catch (error) {
    console.error('Error saving contact hero:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save contact hero'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
