import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Lightweight middleware — no bcryptjs, only JWT verification.
 * Protected write routes redirect to /login if no session token is found.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes that require authentication
  const protectedPaths = ['/create', '/my-materials', '/materials']
  const isProtectedWrite =
    pathname === '/create' ||
    pathname === '/my-materials' ||
    (pathname.startsWith('/materials/') && pathname.endsWith('/edit'))

  if (!isProtectedWrite) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/create', '/my-materials', '/materials/:path*/edit'],
}
