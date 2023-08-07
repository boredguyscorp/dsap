import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up')

    // console.log('bbbbbbbbbbbbbbbbbb')

    if (isAuthPage) {
      // console.log('iiiiiiii')
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      let from = req.nextUrl.pathname
      // console.log('🚀 -> middleware -> req.nextUrl:', req.url)
      // console.log('🚀 -> middleware -> from:', from)

      // console.log('nnnnnnnnnnnnnn')

      return null
    }

    // console.log('yyyyy')

    if (!isAuth) {
      // console.log('isAuth bbbbbbb')
      let from = req.nextUrl.pathname

      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      const requestHeaders = new Headers(req.headers)
      // console.log('🚀 -> middleware -> requestHeaders:', requestHeaders)

      return NextResponse.redirect(new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        // console.log('zzzzzzzz')
        return true
      }
    }
  }
)

export const config = {
  // matcher: ['/*', '/sign-in', '/sign-up']
  matcher: ['/sign-in', '/sign-up']
}
