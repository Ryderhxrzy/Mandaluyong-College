import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = parseInt(params.id)

    if (!body.step_title) {
      return Response.json({ error: 'Step title is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('admissions_admission_procedures')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    await redis.del('admissions_admission_procedures')

    return Response.json(data[0])
  } catch (error) {
    console.error('Error updating procedure:', error)
    return Response.json({ error: 'Failed to update procedure' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)

    const { error } = await supabase.from('admissions_admission_procedures').delete().eq('id', id)

    if (error) throw error

    await redis.del('admissions_admission_procedures')

    return Response.json({ message: 'Procedure deleted' })
  } catch (error) {
    console.error('Error deleting procedure:', error)
    return Response.json({ error: 'Failed to delete procedure' }, { status: 500 })
  }
}
