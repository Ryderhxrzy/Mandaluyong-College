import { supabaseAdmin } from '@/lib/supabase-admin'
import { redis } from '@/lib/redis'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    const { error } = await supabaseAdmin.from('news_cta_images').delete().eq('id', id)

    if (error) throw error

    await redis.del('news_cta')

    return Response.json({ message: 'CTA image deleted' })
  } catch (error) {
    console.error('Error deleting news cta image:', error)
    return Response.json({ error: 'Failed to delete news cta image' }, { status: 500 })
  }
}
