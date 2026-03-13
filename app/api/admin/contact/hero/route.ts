import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_page_hero')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!data) {
      return Response.json({
        id: null,
        title: 'Let\'s Talk. Get in Touch with MCST',
        subtitle: 'Whether you are a student, parent, or guest, we are here to help.',
        logo_image: '/mcst-logo.png',
      })
    }

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching contact hero:', error)
    return Response.json(
      { error: 'Failed to fetch contact hero data' },
      { status: 500 }
    )
  }
}
