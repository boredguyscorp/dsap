import { getServerSession } from 'next-auth/next'
import * as z from 'zod'

import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  page: z.string()
})

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // console.log('🚀 -> GET -> session:', session)

    // if (!session) {
    //   return new Response('Unauthorized', { status: 403 })
    // }

    const page = request.nextUrl.searchParams.get('page')
    // console.log('🚀 -> GET -> page:', page)

    if (!page) {
      return NextResponse.json({ message: 'Missing page param' }, { status: 400 })
    }

    const posts = await db.post.findMany({
      select: {
        title: true,
        description: true,
        slug: true,
        image: true,
        imageBlurhash: true,
        createdAt: true
      },
      where: { page },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    })

    return NextResponse.json(JSON.stringify(posts))
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized', { status: 403 })
    }

    // const { user } = session

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
        page: body.page
      },
      select: {
        id: true
      }
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
