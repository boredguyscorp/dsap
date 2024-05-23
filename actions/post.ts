'use server'

import db from '@/lib/db'
import { extractFileKeyFromUrl, getBlurDataURL } from '@/lib/utils'
import { Post, Prisma } from '@prisma/client'
import { revalidatePath, revalidateTag } from 'next/cache'
import { customAlphabet } from 'nanoid'
import { withPostAuth } from '@/lib/auth'
import { MultiImage } from '@/components/editor/settings/multi-image-uploader'
import { PostForm, PostSettingsDialogForm } from '@/lib/schema'
import { UTApi } from 'uploadthing/server'
import { UploadFileResult } from 'uploadthing/types'

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7) // 7-character random string
const utapi = new UTApi()

// export const updatePost = async (data: Post) => {
//   const post = await db.post.findUnique({
//     select: { id: true },
//     where: {
//       id: data.id
//     }
//   })

//   if (!post) {
//     return {
//       error: 'Post not found - updatePost'
//     }
//   }

//   try {
//     const result = await db.post.update({
//       where: {
//         id: data.id
//       },
//       data: {
//         title: data.title,
//         description: data.description,
//         content: data.content
//       }
//     })

//     revalidatePath(`/cpanel/${result.page}`)
//     revalidatePath(`posts-${result.page}`)
//     revalidatePath(`posts-landing-${result.page}`)

//     return result
//   } catch (error: any) {
//     return {
//       error: error.message
//     }
//   }
// }

export const deletePost = async (id: string) => {
  const post = await db.post.findUnique({
    select: { id: true, image: true, imagesGallery: true },
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

    //?delete also the related files
    if (post.image) {
      await utapi.deleteFiles(extractFileKeyFromUrl(post.image))
    }

    if (post.imagesGallery && (post.imagesGallery as string[]).length > 0) {
      const imagesGallery = post.imagesGallery as string[]
      const imagesGalleryDeleted: Promise<{ success: boolean }>[] = []

      imagesGallery.forEach((image) => {
        imagesGalleryDeleted.push(utapi.deleteFiles(extractFileKeyFromUrl(image)))
      })

      await Promise.all(imagesGalleryDeleted)
    }

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)
    revalidatePath(`posts-landing-${result.page}`)

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
    revalidatePath(`posts-${post.page}`)
    revalidatePath(`posts-landing-${post.page}`)

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
    revalidatePath(`posts-landing-${result.page}`)

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
    revalidatePath(`posts-landing-${result.page}`)

    return result
  } catch (error: any) {
    return {
      error: error.message
    }
  }
}

export const updatePostSettings = async (formValues: PostSettingsDialogForm, formData: FormData) => {
  try {
    const post = await db.post.findUnique({
      where: { id: formValues.id }
    })

    if (!post) return { error: true, status: 404, message: 'Post does not exist.' }

    const isSlugExist = await db.post.findUnique({
      where: { slug: formValues.slug, NOT: { slug: { equals: post.slug } } }
    })

    if (isSlugExist) return { error: true, status: 409, message: 'Slug already exist.' }

    //? get file value from formData
    const imageFile = formData.get('image') as File | null
    const imagesGallery: File[] = []

    if (formValues.imagesGallery && formValues.imagesGallery.length > 0) {
      formValues.imagesGallery.forEach((imgUrl, i) => {
        imagesGallery.push(formData.get(`image-gallery-${i}`) as File)
      })
    }

    //? process upload

    //? deletion of previously uploaded files which will replace by new ones
    const imageFileKey = extractFileKeyFromUrl(post.image ?? '')
    imageFile && imageFileKey ? await utapi.deleteFiles(imageFileKey) : null

    //? user pass empty/no-value data for optional field files property then delete the file if he previously uploaded for that field if it exist
    //? e.g image, if user does not provide value but he/she previouly uploaded a file for that field, thus uploaded file should be deleted
    if (!imageFile && !formValues.image && post.image) await utapi.deleteFiles(imageFileKey)

    //? uploading new files which will replace the old uploaded files
    const image = imageFile ? await utapi.uploadFiles(imageFile) : null

    console.log('image = ', image)

    //? for imageGallery, delete all images gallery file uploads for simplicity of the logic, then upload new ones
    const postImagesGallery = post.imagesGallery as string[]
    if (post.imagesGallery && postImagesGallery.length > 0) {
      const imagesGalleryPromisesDelete: Promise<{ success: boolean }>[] = []

      postImagesGallery.forEach((image) => {
        imagesGalleryPromisesDelete.push(utapi.deleteFiles(extractFileKeyFromUrl(image)))
      })

      await Promise.all(imagesGalleryPromisesDelete)
    }

    //? upload files
    let imagesGalleryUploads: string[] = []
    if (imagesGallery && imagesGallery.length > 0) {
      const imagesGalleryPromisesUploads: Promise<UploadFileResult>[] = []

      imagesGallery.forEach((image) => {
        imagesGalleryPromisesUploads.push(utapi.uploadFiles(image))
      })

      const uploadedFiles = await Promise.all(imagesGalleryPromisesUploads)
      imagesGalleryUploads = uploadedFiles.map((file) => file.data?.url ?? '')
    }

    const result = await db.post.update({
      data: {
        ...formValues,
        image: image ? image.data?.url ?? '' : formValues.image ? post.image : '',
        imagesGallery: imagesGalleryUploads.length > 0 ? imagesGalleryUploads : []
      },
      where: { id: post.id }
    })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)
    revalidatePath(`posts-landing-${result.page}`)

    return result
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return { error: true, status: 409, message: 'Slug already exist.' }
      else throw new Error('Prisma error')
    }

    throw new Error('UPDATE_POST_SETTINGS_ERROR: Server Action Error')
  }
}

export const updatePostPublished = async (id: string, published: boolean) => {
  try {
    const post = await db.post.findUnique({ where: { id } })

    if (!post) return { error: true, status: 404, message: 'Post does not exist.' }

    revalidateTag(`/cpanel/${post.page}`)
    revalidatePath(`posts-${post.page}`)
    revalidatePath(`posts-landing-${post.page}`)

    return await db.post.update({ data: { published }, where: { id } })
  } catch (error) {
    console.error('UPDATE_POST_PUBLISHED_ERROR', error)
    throw new Error('UPDATE_POST_PUBLISHED_ERROR: Server Action Error')
  }
}

export const updatePost = async (formValues: PostForm & { id: string }, formData: FormData) => {
  try {
    const post = await db.post.findUnique({
      where: { id: formValues.id }
    })

    if (!post) return { error: true, status: 404, message: 'Post does not exist.' }

    //? get file value from formData
    const imageFile = formData.get('image') as File | null
    const imagesGallery: File[] = []

    if (formValues.imagesGallery && formValues.imagesGallery.length > 0) {
      formValues.imagesGallery.forEach((imgUrl, i) => {
        imagesGallery.push(formData.get(`image-gallery-${i}`) as File)
      })
    }

    //? process upload

    //? deletion of previously uploaded files which will replace by new ones
    const imageFileKey = extractFileKeyFromUrl(post.image ?? '')
    imageFile && imageFileKey ? await utapi.deleteFiles(imageFileKey) : null

    //? user pass empty/no-value data for optional field files property then delete the file if he previously uploaded for that field if it exist
    //? e.g image, if user does not provide value but he/she previouly uploaded a file for that field, thus uploaded file should be deleted
    if (!imageFile && !formValues.image && post.image) await utapi.deleteFiles(imageFileKey)

    //? uploading new files which will replace the old uploaded files
    const image = imageFile ? await utapi.uploadFiles(imageFile) : null

    //? for imageGallery, delete all images gallery file uploads for simplicity of the logic, then upload new ones
    const postImagesGallery = post.imagesGallery as string[]
    if (post.imagesGallery && postImagesGallery.length > 0) {
      const imagesGalleryPromisesDelete: Promise<{ success: boolean }>[] = []

      postImagesGallery.forEach((image) => {
        imagesGalleryPromisesDelete.push(utapi.deleteFiles(extractFileKeyFromUrl(image)))
      })

      await Promise.all(imagesGalleryPromisesDelete)
    }

    //? upload files
    let imagesGalleryUploads: string[] = []
    if (imagesGallery && imagesGallery.length > 0) {
      const imagesGalleryPromisesUploads: Promise<UploadFileResult>[] = []

      imagesGallery.forEach((image) => {
        imagesGalleryPromisesUploads.push(utapi.uploadFiles(image))
      })

      const uploadedFiles = await Promise.all(imagesGalleryPromisesUploads)
      imagesGalleryUploads = uploadedFiles.map((file) => file.data?.url ?? '')
    }

    const result = await db.post.update({
      data: {
        ...formValues,
        image: image ? image.data?.url ?? '' : formValues.image ? post.image : '',
        imagesGallery: imagesGalleryUploads.length > 0 ? imagesGalleryUploads : []
      },
      where: { id: post.id }
    })

    revalidatePath(`/cpanel/${result.page}`)
    revalidatePath(`posts-${result.page}`)
    revalidatePath(`posts-landing-${result.page}`)

    return result
  } catch (error) {
    console.error('UPDATE_POST', error)
    throw new Error('UPDATE_POST: Server Action Error')
  }
}
