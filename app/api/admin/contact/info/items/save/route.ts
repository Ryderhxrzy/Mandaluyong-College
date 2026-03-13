import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    const { data: infoData } = await supabase
      .from('contact_page_info')
      .select('id')
      .eq('is_active', true)
      .single()

    if (!infoData) {
      return Response.json(
        { error: 'Contact info not found' },
        { status: 404 }
      )
    }

    const contactInfoId = infoData.id

    // Delete existing items
    await supabase
      .from('contact_page_info_items')
      .delete()
      .eq('contact_info_id', contactInfoId)

    const itemsToInsert = items.map((item: any, index: number) => ({
      contact_info_id: contactInfoId,
      type: item.type,
      label: item.label,
      content: item.content,
      order: index,
    }))

    if (itemsToInsert.length === 0) {
      return Response.json([])
    }

    const { data, error } = await supabase
      .from('contact_page_info_items')
      .insert(itemsToInsert)
      .select()

    if (error) throw error
    return Response.json(data)
  } catch (error) {
    console.error('Error saving contact items:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save contact items'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
