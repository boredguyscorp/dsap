import { NextResponse } from 'next/server'

import db from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const requestHeaders = new Headers(req.headers)
    const userId = requestHeaders.get('x-user')

    // cookies().set('userId', userId || '')

    // cookies().set('organizationId', '', { expires: new Date(Date.now()), path: '/' })

    console.log('🚀 -> GET -> userId:', userId)

    cookies().set({ name: 'name', value: userId || 'xxx' })

    cookies().set({ name: 'userId', value: '', maxAge: 0, path: '/' })
    cookies().set({ name: 'organizationId', value: '', maxAge: 0, path: '/' })

    // TODO: not sure why this userId is NULL
    // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
    // console.log('🚀 -> GET -> userId:', userId)

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    // cookies().set('userId', userId)

    const organizationData = await db.organization.findMany({
      where: {
        userId
      },
      include: { business: { select: { id: true, code: true, name: true }, orderBy: { name: 'asc' } } },
      orderBy: { name: 'asc' }
    })

    // const organizationData = await db.organization.findMany({
    //   include: { business: { select: { id: true, code: true, name: true }, orderBy: { name: 'asc' } } },
    //   orderBy: { name: 'asc' }
    // })

    if (!organizationData) {
      return new NextResponse('Unprocessable entity', { status: 422 })
    }

    // console.log('getsss', cookies().get('userId'))

    // console.log('zzzzzzzzzzzzzz')

    // cookies().set('zzzzz', 'zzzzzzzz')
    // console.log('bababababa')
    // cookies().set('abc', '123456')
    // console.log(cookies().get('abc'))

    // console.log(cookies().get('userId'))

    return NextResponse.json(organizationData)
  } catch (error) {
    console.log('[ORGANIZATION_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
