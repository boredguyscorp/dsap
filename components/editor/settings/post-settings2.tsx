'use client'

import { memo, useEffect, useState, useTransition } from 'react'
import { PostSettingsDialogForm, PostSettingsDialogFormSchema } from '@/lib/schema'
import { useZodForm } from '@/lib/zod-form'
import { Post } from '@prisma/client'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import Link from 'next/link'
import { siteConfig } from '@/app/config'
import { Label } from '@/components/ui/label'
import { Form } from '@/components/ui/form'
import { InputFieldForm } from '@/components/forms/InputFieldForm'
import { ImageUploader } from '@/components/image-uploader'
import { getFileFromBlobUrl } from '@/lib/utils'
import { updatePostSettings } from '@/actions/post'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

type PostSettingsDialogProps = Pick<Post, 'id' | 'slug' | 'title' | 'image' | 'imagesGallery' | 'page'>

const PostSettingsDialog = ({ post }: { post: PostSettingsDialogProps }) => {
  const form = useZodForm({
    schema: PostSettingsDialogFormSchema,
    defaultValues: {
      id: post.id,
      slug: post.slug,
      imagesGallery: (post.imagesGallery as string[]) ?? [],
      image: post.image ?? ''
    }
  })

  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const url = `${siteConfig.url.home}/${post.page}/${post.slug}`

  const onSubmit = (data: PostSettingsDialogForm) => {
    startTransition(async () => {
      try {
        const formData = new FormData()

        if (data.image && data.image.startsWith('blob:')) {
          const imageFile = await getFileFromBlobUrl(data.image)
          formData.append('image', imageFile)
        }

        if (data.imagesGallery && data.imagesGallery.length > 0) {
          const promises: Promise<File>[] = []

          data.imagesGallery.forEach((image) => {
            promises.push(getFileFromBlobUrl(image))
          })

          const imgGalleryFiles = await Promise.all(promises)

          imgGalleryFiles.forEach((file, i) => {
            formData.append(`image-gallery-${i}`, file)
          })
        }

        const result = await updatePostSettings(data, formData)

        if (result && !('error' in result)) {
          toast.success('Successfully update post settings.')
          onClose()

          router.refresh()
          return
        }

        if (result && 'error' in result && result.status === 409) {
          form.setError('slug', { message: 'Slug already exist.' })
          toast.error('Slug already exist.')
          return
        }

        toast.error(result?.message ?? 'Something went wrong.')
      } catch (error) {
        console.error(error)
        toast.error('Error updating post setting. Please try again.')
      }
    })
  }

  const onClose = () => {
    setIsOpen(false)
    form.reset()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isPending) return

        if (!open) {
          onClose()
          return
        }

        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Icons.settings className='h-4 w-4 text-slate-600' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[780px] overflow-y-scroll sm:max-w-[900px]'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Make changes to your post. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className='flex items-center'>
          <Link href={url} target='_blank' rel='noopener noreferrer' className='flex items-center space-x-2 '>
            <Label className='cursor-pointer text-base font-bold text-teal-600'>{post.title}</Label>

            <Icons.link className='h-5 w-5 text-sm text-slate-600 hover:text-slate-800' />
          </Link>
        </div>

        <Form {...form}>
          <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <InputFieldForm
                control={form.control}
                name='slug'
                fieldProps={{ placeholder: 'Slug', required: true }}
                extendedProps={{ label: 'Slug', description: 'The slug is the URL-friendly version of the name. **e.g. your-post-name' }}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div>
                <Label>Thumbnail Image</Label>
                <p className='text-xs text-slate-500'>Accepted format: .png, .jpg, .jpeg</p>
              </div>

              <ImageUploader
                label='Photo'
                value={form.getValues('image') ?? ''}
                uploaderKey='post-setting-dialog-imgUrl'
                icon={Icons.media}
                limitSize={4}
                isMultiple={false}
                display={null}
                className='h-[400px] w-full p-0'
                onChange={(url) => {
                  form.setValue('image', url ?? '')
                  form.clearErrors('image')
                }}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div>
                <Label>Image Gallery</Label>
                <p className='text-xs text-slate-500'>Accepted format: .png, .jpg, .jpeg</p>
              </div>

              <ImageUploader
                label='Photo'
                value={form.getValues('imagesGallery') ?? []}
                uploaderKey='post-setting-dialog-imgGallery'
                icon={Icons.media}
                limitSize={4}
                isMultiple={true}
                display='compact'
                className='h-[240px] w-full p-0'
                onChange={(url) => {
                  form.setValue('imagesGallery', url ?? [])
                  form.clearErrors('imagesGallery')
                }}
              />
            </div>

            <DialogFooter>
              <Button variant='outline' disabled={isPending} onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PostSettingsDialog
