import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import urls from './constants/url'
import { navItems } from './app/config'

const publicUrl = navItems.map((url) => url.href)

export default withAuth(
  async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const hostname = req.headers.get('host')
    const url = req.nextUrl

    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up')

    const currentHost = hostname?.replace(`.${urls.homeWithoutApp}`, '')

    // console.log('🚀 -> middleware -> currentHost:', currentHost)

    if (currentHost === 'app') {
      if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
        if (isAuth) {
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
        return res
      }

      url.pathname = `/dashboard${url.pathname}`
      return NextResponse.rewrite(url)
    }

    return res

    // const token = await getToken({ req })
    // const isAuth = !!token
    // const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up')

    // if (isAuthPage) {
    //   if (isAuth) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url))
    //   }

    //   return null
    // }

    // if (!isAuth) {
    //   let from = req.nextUrl.pathname

    //   if (req.nextUrl.search) {
    //     from += req.nextUrl.search
    //   }

    //   if (publicUrl.includes(from)) {
    //     return null
    //   }

    //   return NextResponse.redirect(new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url))
    // }
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
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)'
  ]
}

// export const config = {
//   // matcher: ['/*', '/sign-in', '/sign-up']
//   matcher: ['/sign-in', '/sign-up']
// }
