import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('admissions_cta')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (error) throw error

    const { data: images, error: imagesError } = await supabaseAdmin
      .from('admissions_cta_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (imagesError) throw imagesError

    return Response.json({ ...data, images: images ?? [] })
  } catch (error) {
    console.error('Error fetching admissions CTA:', error)
    return Response.json({ error: 'Failed to fetch admissions CTA' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description } = await request.json()

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_cta')
      .update({ title, description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_cta')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating admissions CTA:', error)
    return Response.json({ error: 'Failed to update admissions CTA' }, { status: 500 })
  }
}
