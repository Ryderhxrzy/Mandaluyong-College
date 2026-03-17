import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { qualification_text } = await request.json()
    const id = parseInt(params.id)

    if (!qualification_text) {
      return Response.json({ error: 'Qualification text is required' }, { status: 400 })
    }

    const { data, error } = await supabase
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const { error } = await supabase.from('admissions_qualifications').delete().eq('id', id)

    if (error) throw error

    // Invalidate cache
    await redis.del('admissions_qualifications')

    return Response.json({ message: 'Qualification deleted' })
  } catch (error) {
    console.error('Error deleting qualification:', error)
    return Response.json({ error: 'Failed to delete qualification' }, { status: 500 })
  }
}
