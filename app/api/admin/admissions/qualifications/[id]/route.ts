import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { qualification_text } = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (!qualification_text) {
      return Response.json({ error: 'Qualification text is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_qualifications')
      .update({ qualification_text, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    // Invalidate cache
    await redis.del('admissions_qualifications')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating qualification:', error)
    return Response.json({ error: 'Failed to update qualification' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('admissions_qualifications').delete().eq('id', id)

    if (error) throw error

    // Invalidate cache
    await redis.del('admissions_qualifications')

    return Response.json({ message: 'Qualification deleted' })
  } catch (error) {
    console.error('Error deleting qualification:', error)
    return Response.json({ error: 'Failed to delete qualification' }, { status: 500 })
  }
}
