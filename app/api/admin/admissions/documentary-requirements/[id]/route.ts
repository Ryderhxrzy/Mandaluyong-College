import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { requirement_text, requirement_type } = await request.json()
    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (!requirement_text) {
      return Response.json({ error: 'Requirement text is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('admissions_documentary_requirements')
      .update({ requirement_text, requirement_type: requirement_type || 'main', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_documentary_requirements')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating requirement:', error)
    return Response.json({ error: 'Failed to update requirement' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('admissions_documentary_requirements').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_documentary_requirements')

    return Response.json({ message: 'Requirement deleted' })
  } catch (error) {
    console.error('Error deleting requirement:', error)
    return Response.json({ error: 'Failed to delete requirement' }, { status: 500 })
  }
}
