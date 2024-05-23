'use client'

import Link from 'next/link'
import { memo, useTransition } from 'react'

import Badge from '@/components/custom/badge'
import { Icons } from '@/components/shared/icons'
import { Post } from '@prisma/client'
import { cn, getFileFromBlobUrl, toProperCase } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { siteConfig } from '@/app/config'
import PostSettingsDialog from '@/components/editor/settings/post-settings2'
import { updatePost, updatePostMetadata, updatePostPublished } from '@/actions/post'
import { toast } from 'sonner'
import AdvanceEditor from '@/components/advance-text-editor'
import { useZodForm } from '@/lib/zod-form'
import { PostForm, PostFormSchema } from '@/lib/schema'
import { InputFieldForm } from '@/components/forms/InputFieldForm'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/image-uploader'

interface PostFormProps {
  post: Post
}

const PostForm = memo(function PostForm({ post }: PostFormProps) {
  const form = useZodForm({
    schema: PostFormSchema,
    defaultValues: {
      title: post.title,
      content: post.content ?? '',
      description: post.description ?? '',
      image: post.image ?? '',
      imagesGallery: (post.imagesGallery as string[]) ?? []
    }
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams?.get('page')

  let [isPendingSaving, startTransitionSaving] = useTransition()
  let [isPendingPublishing, startTransitionPublishing] = useTransition()

  const url = siteConfig.url.home + '/' + post.page + '/' + post.slug

  const handlePublish = () => {
    startTransitionPublishing(async () => {
      try {
        const result = await updatePostPublished(post.id, post.published ? false : true)

        if (result && 'error' in result && result.status === 404) {
          toast.error(result.message)
          return
        }

        if (result && !('error' in result)) {
          toast.success(`Successfully ${post.published ? 'unpublished' : 'published'} post.`)
          router.refresh()
          return
        }

        toast.error('Something went wrong, Please try again.')
      } catch (error) {
        console.error(error)
        toast.error('Error publishing post.')
      }
    })
  }
  const handleSaved = (data: PostForm) => {
    startTransitionSaving(async () => {
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

        const result = await updatePost({ ...data, id: post.id }, formData)

        if (result && 'error' in result && result.status === 404) {
          toast.error(result.message)
          return
        }

        if (result && !('error' in result)) {
          toast.success('Successfully update post.')

          router.refresh()
          return
        }

        toast.error('Something went wrong. Please try again.')
      } catch (error) {
        console.error(error)
        toast.error('Error updating post setting. Please try again.')
      }
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSaved)}
      className='relative mx-auto min-h-screen w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:rounded-lg sm:border sm:px-12 sm:shadow-lg'
    >
      <Form {...form}>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-8 dark:border-stone-700'>
          <div className='-ml-4 flex items-center space-x-4'>
            <Link href={`/cpanel/${post.page}`} className={cn(buttonVariants({ variant: 'ghost' }))}>
              <>
                <Icons.chevronLeft className='mr-2 h-4 w-4' />
                Back
              </>
            </Link>
            {page ? <Badge text={toProperCase(page)} variant='teal' /> : null}
            <Badge text={post.published ? 'Publish' : 'Draft'} variant={post.published ? 'black' : 'outline'} />
          </div>

          <div className='flex items-center space-x-3'>
            {post.published && (
              <Link
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-800'
              >
                <Icons.link className='h-5 w-5' />
              </Link>
            )}

            <Button type='button' onClick={handlePublish} disabled={isPendingPublishing} variant='secondary'>
              {isPendingPublishing && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              <span>{post.published ? 'Unpublish' : 'Publish'}</span>
            </Button>

            <Button type='submit' disabled={isPendingSaving}>
              {isPendingSaving && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              <span>Save</span>
            </Button>
          </div>
        </div>

        <div className='mt-3. place- mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700'>
          <div className='relative flex flex-col gap-4'>
            <div className='flex flex-col'>
              <Label className='ml-3 text-slate-600'>Title: *</Label>

              <InputFieldForm
                control={form.control}
                name='title'
                fieldProps={{
                  placeholder: 'Title',
                  className: '-mt-1.5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus py-0 font-bold text-3xl'
                }}
                extendedProps={{ label: 'Title', labelClassName: 'hidden', errorMessageClassName: 'px-3' }}
              />
            </div>

            <div className='flex flex-col gap-y-1.5'>
              <Label className='ml-3 text-slate-600'>Description: *</Label>

              <AdvanceEditor
                value={form.getValues('description')}
                onChange={(content) => {
                  form.setValue('description', content)
                  form.clearErrors('description')
                }}
                editorClassName='!py-0 !px-3'
                className='min-h-[24px] sm:mb-0 sm:rounded-none sm:border-0 sm:shadow-none'
                isError={!!form.formState.errors.description}
                errorMessage={form.formState.errors.description?.message}
                errorClassName='px-3'
              />
            </div>
          </div>
        </div>

        <div className='border-b border-stone-200 pb-5'>
          <div className='flex flex-col gap-y-1.5'>
            <Label className='ml-3 text-slate-600'>Content: *</Label>

            <AdvanceEditor
              value={form.getValues('content') ?? ''}
              onChange={(content) => {
                form.setValue('content', content)
                form.clearErrors('content')
              }}
              editorClassName='!py-0 !px-3'
              className='max-h-[540px] min-h-[540px] overflow-y-auto sm:mb-0 sm:rounded-none sm:border-0 sm:shadow-none'
            />
          </div>
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          <div className='flex flex-col gap-2 lg:mt-3'>
            <div>
              <Label className='text-slate-600'>Thumbnail Image</Label>
              <p className='text-xs text-slate-500'>Accepted format: .png, .jpg, .jpeg</p>
            </div>

            <ImageUploader
              label='Photo'
              value={form.getValues('image') ?? ''}
              uploaderKey='post-image'
              icon={Icons.media}
              limitSize={4}
              isMultiple={false}
              display={null}
              className='h-[440px] w-full p-0'
              onChange={(url) => {
                form.setValue('image', url ?? '')
                form.clearErrors('image')
              }}
            />
          </div>

          <div className='flex flex-col gap-2 lg:mt-3'>
            <div>
              <Label className='text-slate-600'>Image Gallery:</Label>
              <p className='text-xs text-slate-500'>Accepted format: .png, .jpg, .jpeg</p>
            </div>

            <ImageUploader
              label='Photo'
              value={form.getValues('imagesGallery') ?? []}
              uploaderKey='post-imgGallery'
              icon={Icons.media}
              limitSize={4}
              isMultiple={true}
              display='compact'
              className='h-[440px] w-full p-0'
              onChange={(url) => {
                form.setValue('imagesGallery', url ?? [])
                form.clearErrors('imagesGallery')
              }}
            />
          </div>
        </div>
      </Form>
    </form>
  )
})

export default PostForm
