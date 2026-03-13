import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: infoData, error } = await supabase
      .from('contact_page_info')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!infoData) {
      return Response.json({
        id: null,
        section_image: '/join2.jpg',
        items: [],
      })
    }

    const { data: items } = await supabase
      .from('contact_page_info_items')
      .select('*')
      .eq('contact_info_id', infoData.id)
      .order('order', { ascending: true })

    return Response.json({
      id: infoData.id,
      section_image: infoData.section_image,
      items: items || [],
    })
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return Response.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}
