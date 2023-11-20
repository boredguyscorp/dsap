'use server'

import db from '@/lib/db'
import { getBlurDataURL } from '@/lib/utils'
import { Post } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { customAlphabet } from 'nanoid'
import { withPostAuth } from '@/lib/auth'
import { MultiImage } from '@/components/editor/settings/multi-image-uploader'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7) // 7-character random string

export const updatePost = async (data: Post) => {
  const post = await db.post.findUnique({
    select: { id: true },
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
    const result = await db.post.update({
      where: {
        id: data.id
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content
      }
    })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)

    return result
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}

export const deletePost = async (id: string) => {
  const post = await db.post.findUnique({
    select: { id: true },
    where: {
      id
    }
  })

  if (!post) {
    return {
      error: 'Post not found - deletePost'
    }
  }

  try {
    const result = await db.post.delete({ where: { id }, select: { id: true, page: true } })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)

    return result
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

type MetaDataSettings = {
  id: string
  slug: string
  img?: string | null
}

export const updateMetaDataSettings = async (data: MetaDataSettings) => {
  const { id, slug, img } = data

  const post = await db.post.findUnique({
    select: { id: true },
    where: {
      id
    }
  })

  if (!post) {
    return {
      error: 'Post not found - updatePost'
    }
  }

  try {
    const result = await db.post.update({
      where: {
        id
      },
      data: {
        slug,
        image: img
      }
    })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)

    return result
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}

type PostImageGallery = {
  id: string
  imagesGallery: MultiImage[]
}

export const updatePostImageGallery = async (data: PostImageGallery) => {
  const { id, imagesGallery } = data

  const post = await db.post.findUnique({
    select: { id: true },
    where: {
      id
    }
  })

  if (!post) {
    return {
      error: 'Post not found - updatePost'
    }
  }

  try {
    const result = await db.post.update({
      where: {
        id
      },
      data: {
        imagesGallery
      }
    })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)

    return result
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}
