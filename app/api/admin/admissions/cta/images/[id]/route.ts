import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { image_url, alt_text } = await request.json()
    const { id } = await params

    // Validate that the image exists
    const { data: existingImage, error: fetchError } = await supabaseAdmin
      .from('admissions_cta_images')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingImage) {
      return Response.json({ error: 'Image not found' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_cta_images')
      .update({ image_url, alt_text, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_cta')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating CTA image:', error)
    return Response.json({ error: 'Failed to update CTA image' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Validate that the image exists
    const { data: existingImage, error: fetchError } = await supabaseAdmin
      .from('admissions_cta_images')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingImage) {
      return Response.json({ error: 'Image not found' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('admissions_cta_images')
      .delete()
      .eq('id', id)

    if (error) throw error

    await redis.del('admissions_cta')

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting CTA image:', error)
    return Response.json({ error: 'Failed to delete CTA image' }, { status: 500 })
  }
}
