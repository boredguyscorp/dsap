import { getToken } from 'next-auth/jwt'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    .middleware(async (req) => {
      const user = await getToken(req)

      return { userId: user?.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
  photoUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async (req) => {
      const user = await getToken(req)

      return { userId: user?.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
  proofOfPaymentUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async (req) => {
      const user = await getToken(req)

      return { userId: user?.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {}),
  pdfUploader: f({ pdf: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async (req) => {
      const user = await getToken(req)

      return { userId: user?.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
