import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { program, strand_requirement } = await request.json()
    const id = parseInt(params.id)

    if (!program || !strand_requirement) {
      return Response.json({ error: 'Program and strand requirement are required' }, { status: 400 })
    }

    const { data, error } = await supabase
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const { error } = await supabase.from('admissions_required_strands').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_required_strands')

    return Response.json({ message: 'Strand deleted' })
  } catch (error) {
    console.error('Error deleting strand:', error)
    return Response.json({ error: 'Failed to delete strand' }, { status: 500 })
  }
}
