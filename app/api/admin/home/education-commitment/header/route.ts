import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and Description are required' }, { status: 400 })
    }

    // Check if any rows exist
    const { count } = await supabaseAdmin
      .from('quality_education_commitment_home_page')
      .select('*', { count: 'exact', head: true })

    let result;
    if (count === 0) {
      // Insert a placeholder row if the table is empty
      result = await supabaseAdmin
        .from('quality_education_commitment_home_page')
        .insert([{ 
          title, 
          description, 
          icon: 'ShieldCheck', 
          icon_title: 'Placeholder', 
          value: '',
          is_active: false // Keep it hidden until the user actually adds content
        }])
        .select()
    } else {
      // Update title and description for ALL rows in the table
      result = await supabaseAdmin
        .from('quality_education_commitment_home_page')
        .update({ title, description })
        .neq('id', 0)
        .select()
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('Error updating education commitment header:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
