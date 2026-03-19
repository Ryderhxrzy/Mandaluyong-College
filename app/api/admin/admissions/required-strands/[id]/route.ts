import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { program, strand_requirement } = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (!program || !strand_requirement) {
      return Response.json({ error: 'Program and strand requirement are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_required_strands')
      .update({ program, strand_requirement, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_required_strands')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating strand:', error)
    return Response.json({ error: 'Failed to update strand' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('admissions_required_strands').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_required_strands')

    return Response.json({ message: 'Strand deleted' })
  } catch (error) {
    console.error('Error deleting strand:', error)
    return Response.json({ error: 'Failed to delete strand' }, { status: 500 })
  }
}
