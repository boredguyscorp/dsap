import db from '@/lib/db'
import { unstable_cache } from 'next/cache'

export async function getPostsForSite(page: string) {
  return await unstable_cache(
    async () => {
      return db.post.findMany({
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true
        },
        orderBy: [
          {
            createdAt: 'desc'
          }
        ]
      })
    },
    [`${page}-posts`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${page}-posts`]
    }
  )()
}

export async function getPostData(page: string, slug: string) {
  return await unstable_cache(
    async () => {
      const data = await db.post.findFirst({
        // where: {
        //   AND: { slug: 'event', slug: slug, published: true }
        // },
        where: {
          slug: slug
        },
        select: {
          slug: true,
          title: true,
          description: true,
          published: true,
          createdAt: true,
          content: true
        }
      })

      return data
    },
    [`${page}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${page}-${slug}`]
    }
  )()
}
