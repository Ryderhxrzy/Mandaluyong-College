import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

/**
 * Example GET endpoint showing how to query Supabase
 *
 * Usage: GET /api/example
 */
export async function GET() {
  try {
    // Example: Fetch all users
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(10)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Example POST endpoint showing how to insert data into Supabase
 *
 * Usage: POST /api/example
 * Body: { email: "user@example.com", username: "john" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Example: Insert a new user
    const { data, error } = await supabase
      .from('users')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
