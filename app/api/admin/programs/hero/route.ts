import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: heroData, error } = await supabaseAdmin
      .from('programs_hero_section')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const defaultData = {
      id: null,
      imageUrl: '/banner.jpg',
    }

    if (!heroData?.id) {
      console.log('No hero data found, returning default')
      return NextResponse.json(defaultData)
    }

    const responseData = {
      id: heroData.id.toString(),
      imageUrl: heroData.background_image || '/banner.jpg',
    }

    console.log('Hero response:', responseData)
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching hero:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}
