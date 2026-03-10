import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/password-hash'
import { signJWT } from '@/lib/jwt'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Query the admin_accounts table
    const { data: admin, error } = await supabaseAdmin
      .from('admin_accounts')
      .select('id, email, password_hash, first_name, last_name, full_name, is_active, role')
      .eq('email', email)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if admin account is active
    if (!admin.is_active) {
      return NextResponse.json(
        { message: 'This account has been deactivated' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signJWT({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.full_name || '',
    })

    // Update last login timestamp
    const { error: updateError } = await supabaseAdmin
      .from('admin_accounts')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    if (updateError) {
      console.error('Error updating last login:', updateError)
    }

    // Create response with token
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.first_name,
          lastName: admin.last_name,
          fullName: admin.full_name,
          role: admin.role,
        },
      },
      { status: 200 }
    )

    // Set httpOnly cookie for server-side session validation
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}
