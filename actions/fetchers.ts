import db from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { serialize } from 'next-mdx-remote/serialize'
import { replaceExamples, replaceTweets } from '@/lib/remark-plugins'
import url from '@/constants/url'
import { Post } from '@prisma/client'
import { Pages } from '@/app/(root)/_constant/constant'

type PostOptions = {
  take?: number
}

export async function getPostsForSite(page: string, options?: PostOptions) {
  return await unstable_cache(
    async () => {
      return db.post.findMany({
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true,
          page: true,
          content: true,
          imagesGallery: true
        },
        where: { page },
        orderBy: [
          {
            createdAt: 'desc'
          }
        ],
        ...(options?.take && { take: options?.take })
      })
    },
    [`posts-${page}`],
    {
      revalidate: 20, // 86400 = 1 day cache (900 = 15 minutes)
      tags: [`posts-${page}`]
    }
  )()
}

export async function getPostsForLandingPage(page: Pages, options?: PostOptions) {
  return await unstable_cache(
    async () => {
      return db.post.findMany({
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true,
          page: true,
          content: true,
          imagesGallery: true
        },
        where: { page },
        orderBy: [
          {
            createdAt: 'desc'
          }
        ],
        ...(options?.take && { take: options?.take })
      })
    },
    [`posts-landing-${page}`],
    {
      revalidate: 20, // 86400 = 1 day cache (900 = 15 minutes)
      tags: [`posts-landing-${page}`]
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
        }
      })

      if (!data) return null

      const [mdxSource, adjacentPosts] = await Promise.all([
        getMdxSource(data.content!),
        db.post.findMany({
          where: {
            published: true,
            NOT: {
              id: data.id
            }
          },
          select: {
            slug: true,
            title: true,
            createdAt: true,
            description: true,
            image: true,
            imageBlurhash: true,
            page: true
          }
        })
      ])

      return {
        ...data,
        mdxSource,
        adjacentPosts
      }
    },
    [`${page}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${page}-${slug}`]
    }
  )()
}

export async function getMdxSource(postContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content = postContents?.replaceAll(/<(https?:\/\/\S+)>/g, '[$1]($1)') ?? ''
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples(db)]
    }
  })

  return mdxSource
}

// export async function API_CALL_getPostDataPerPage(page: string, slug: string) {
//   const result = await fetch(`${url.serverApi}/api/posts/${slug}?page=${page}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     next: { revalidate: 1, tags: [`${page}-${slug}`] } // 86400 = 1 day cache (900 = 15 minutes)
//     // cache: 'no-store'
//   })

//   return result.ok ? (JSON.parse(await result.json()) as Post[]) : null
// }

export async function API_CALL_getPostsForSite(page: 'event' | 'news' | 'convention') {
  const result = await fetch(`${url.serverApi}/api/posts?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 0, tags: [`posts-${page}`] }, // 86400 = 1 day cache (900 = 15 minutes)
    cache: 'no-cache'
  })

  return result.ok ? (JSON.parse(await result.json()) as Post[]) : null
}
