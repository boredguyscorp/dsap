import { getServerSession } from 'next-auth'
import * as z from 'zod'

import { authOptions } from '@/lib/auth'

import db from '@/lib/db'
import { postPatchSchema } from '@/lib/schema'
import { slugify } from '@/lib/utils'

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const routeContextSchema = z.object({
  params: z.object({
    slug: z.string()
  })
})

export async function GET(request: NextRequest, context: z.infer<typeof routeContextSchema>) {
  try {
    // const session = await getServerSession(authOptions)
    // console.log('🚀 -> GET -> session:', session)

    // if (!session) {
    //   return new Response('Unauthorized', { status: 403 })
    // }

    const page = request.nextUrl.searchParams.get('page')
    const { params } = routeContextSchema.parse(context)

    if (!page) {
      return NextResponse.json({ message: 'Missing page param' }, { status: 400 })
    }

    const posts = await db.post.findUnique({
      where: { slug: params.slug }
    })

    return NextResponse.json(JSON.stringify(posts))
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.slug))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await db.post.delete({
      where: {
        slug: params.slug as string
      }
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(req: Request, context: z.infer<typeof routeContextSchema>) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.slug))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = postPatchSchema.parse(json)

    // Update the post.
    // TODO: Implement sanitization for content.
    await db.post.update({
      where: {
        slug: params.slug
      },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        published: body.isPublish
      }
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(slug: string) {
  const session = await getServerSession(authOptions)
  const count = await db.post.count({
    where: {
      slug: slug,
      authorId: session?.user.id
    }
  })

  return count > 0
}
