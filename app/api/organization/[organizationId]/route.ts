import { NextResponse } from 'next/server'

import db from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { organizationId: string } }) {
  try {
    const userId = 'user_XXXXX'
    const body = await req.json()

    const { name } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    if (!params.organizationId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const store = await db.organization.updateMany({
      where: {
        id: params.organizationId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { organizationId: string } }) {
  try {
    const userId = 'user_XXX'

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!params.organizationId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const store = await db.organization.deleteMany({
      where: {
        id: params.organizationId,
        userId
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
