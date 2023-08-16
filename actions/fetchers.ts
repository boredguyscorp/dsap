import db from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { serialize } from 'next-mdx-remote/serialize'
import { replaceExamples, replaceTweets } from '@/lib/remark-plugins'

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

async function getMdxSource(postContents: string) {
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
