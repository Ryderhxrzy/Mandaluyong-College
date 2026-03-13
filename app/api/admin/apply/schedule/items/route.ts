import { supabase } from '@/lib/supabase'

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('id')

    if (!itemId) {
      return Response.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('apply_page_enrollment_schedule_items')
      .delete()
      .eq('id', itemId)

    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting schedule item:', error)
    return Response.json(
      { error: 'Failed to delete schedule item' },
      { status: 500 }
    )
  }
}
