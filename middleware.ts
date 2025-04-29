import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/app/dashboard']

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const accessToken = req.cookies.get('sb-access-token')?.value

  const isProtectedRoute = protectedRoutes.some((path) =>
    url.pathname.startsWith(path)
  )

  if (isProtectedRoute && !accessToken) {
    url.pathname = '/login' // redirection vers la page de connexion
    return NextResponse.redirect(url)
  }

  if (url.pathname === '/' && accessToken) {
    url.pathname = '/app/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/app/dashboard/:path*'],
}
