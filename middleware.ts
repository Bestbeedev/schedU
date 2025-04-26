// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Liste des routes protégées (à adapter selon ton app)
const protectedRoutes = ['/app/dashboard']

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Récupère le token depuis les cookies Supabase
  const accessToken = req.cookies.get('sb-access-token')?.value

  const isProtectedRoute = protectedRoutes.some((path) => url.pathname.startsWith(path))

  if (isProtectedRoute && !accessToken) {
    // Si l'utilisateur n'a pas de token et essaye d'accéder à une route protégée => redirige vers /
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (url.pathname === '/' && accessToken) {
    // Si l'utilisateur est déjà connecté et vient sur la page d'accueil => redirige vers dashboard
    url.pathname = '/app/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Tu peux spécifier où le middleware doit s'appliquer
export const config = {
  matcher: ['/', '/app/dashboard/:path*'],
}
