'use server'

import db from '@/lib/db'
import { getBlurDataURL } from '@/lib/utils'
import { Post } from '@prisma/client'
import { revalidateTag } from 'next/cache'
import { customAlphabet } from 'nanoid'
import { withPostAuth } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'
import { siteConfig } from '@/app/config'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7) // 7-character random string

export const updatePost = async (data: Post) => {
  // const xxxxxx = await getCurrentUser()

  // if (!session?.id) {
  //   return {
  //     error: 'Not authenticated'
  //   }
  // }
  const post = await db.post.findUnique({
    where: {
      id: data.id
    }
  })

  if (!post) {
    return {
      error: 'Post not found - updatePost'
    }
  }

  try {
    const response = await db.post.update({
      where: {
        id: data.id
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content
      }
    })

    revalidateTag(`/cpanel/${post.page}`)
    revalidateTag(siteConfig.url.home + `/${post.page}`)
    // console.log(siteConfig.url.homeWithoutApp + `/${post.page}`)
    // revalidateTag('http://localhost:5000/event')

    // await revalidateTag(`${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`)
    // await revalidateTag(`${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`)

    // // if the site has a custom domain, we need to revalidate those tags too
    // post.site?.customDomain &&
    //   (await revalidateTag(`${post.site?.customDomain}-posts`), await revalidateTag(`${post.site?.customDomain}-${post.slug}`))

    return response
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}

export const updatePostMetadata = withPostAuth(async (formData: FormData, post: Post, key: string) => {
  const value = formData.get(key) as string

  try {
    let response
    if (key === 'image') {
      const file = formData.get('image') as File
      const filename = `${nanoid()}.${file.type.split('/')[1]}`

      // oscar comment
      // const { url } = await put(filename, file, {
      //   access: 'public'
      // })

      const url = 'xxx'

      const blurhash = await getBlurDataURL(url)

      response = await db.post.update({
        where: {
          id: post.id
        },
        data: {
          image: url,
          imageBlurhash: blurhash
        }
      })
    } else {
      response = await db.post.update({
        where: {
          id: post.id
        },
        data: {
          [key]: key === 'published' ? value === 'true' : value
        }
      })
    }

    revalidateTag(`/cpanel/${post.page}`)

    //   await revalidateTag(`${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-posts`)
    //   await revalidateTag(`${post.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-${post.slug}`)

    //   // if the site has a custom domain, we need to revalidate those tags too
    //   post.site?.customDomain &&
    //     (await revalidateTag(`${post.site?.customDomain}-posts`), await revalidateTag(`${post.site?.customDomain}-${post.slug}`))

    return response
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {
        error: `This slug is already in use`
      }
    } else {
      return {
        error: error.message
      }
    }
  }
})
