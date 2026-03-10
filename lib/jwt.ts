import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
)

export interface JWTPayload {
  sub: string | number
  email: string
  role: string
  fullName?: string
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
  return jwt
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}
