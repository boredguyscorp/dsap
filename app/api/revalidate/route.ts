import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const postSlugSchema = z
  .object({
    slug: z.string().or(z.array(z.string()))
  })
  .optional()

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')
  const page = request.nextUrl.searchParams.get('page')
  console.log('🚀 -> POST -> page:', page)

  // if (secret !== process.env.MY_SECRET_TOKEN) {
  //   return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  // }

  if (secret !== process.env.BG_API_SERVICE_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
  }

  if (!page) {
    return NextResponse.json({ message: 'Missing page param' }, { status: 400 })
  }

  //   const json = await request.json()
  //   const body = postSlugSchema.parse(json)
  //   console.log('🚀 -> POST -> body:', body)

  //   revalidateTag(`${tag}-${page}`)
  revalidatePath(`posts-${page}`)
  console.log("xxxxxxxxxxxxxxx -> POST -> tag + '-' + page:", { tag, page })

  return NextResponse.json({ revalidated: true, now: Date.now(), val: 1 })
}

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return new Response('Unauthorized', { status: 403 })
//     }

//     // const { user } = session

//     const json = await req.json()
//     const body = postCreateSchema.parse(json)

//     const post = await db.post.create({
//       data: {
//         title: body.title,
//         content: body.content,
//         authorId: session.user.id,
//         page: body.page
//       },
//       select: {
//         id: true
//       }
//     })

//     return new Response(JSON.stringify(post))
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify(error.issues), { status: 422 })
//     }

//     return new Response(null, { status: 500 })
//   }
// }
