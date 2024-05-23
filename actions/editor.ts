'use server'

import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export const onUpload = async (formData: FormData) => {
  const file = formData.get('file') as File
  const uploaded = await utapi.uploadFiles(file)

  return uploaded.data?.url
}

export const onDelete = async (key: string) => {
  return await utapi.deleteFiles(key)
}
