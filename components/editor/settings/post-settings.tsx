'use client'

import { updateMetaDataSettings, updatePostImageGallery } from '@/actions/post'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Post } from '@prisma/client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { FileUpload } from './file-upload'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { siteConfig } from '@/app/config'
import { MultiImageUploader, MultiImage } from './multi-image-uploader'

type PostSettingsProps = Pick<Post, 'id' | 'slug' | 'title' | 'image' | 'imagesGallery' | 'page'>

export function SettingsDialog({ post }: { post: PostSettingsProps }) {
  const [slug, setSlug] = useState<string>(post.slug)
  const [imgUrl, setImgUrl] = useState<string | null | undefined>(post.image)

  const [imagesToDelete, setImagesToDelete] = useState<MultiImage[]>([])
  const [newImages, setNewImages] = useState<MultiImage[]>([])
  const [updateGallery, setUpdateGallery] = useState(false)

  const [isPendingSaving, startTransitionSaving] = useTransition()
  const isFirstLoad = useRef(true)

  const toaster = useToast()

  const handleUpdateMetaData = () => {
    startTransitionSaving(async () => {
      await updateMetaDataSettings({ id: post.id, slug, img: imgUrl }).then(() => {
        toaster.toast({
          title: `Successfully update post.`,
          variant: 'default'
        })
      })
    })
  }

  const handleUpdateImagesGallery = (imagesGallery: MultiImage[]) => {
    startTransitionSaving(async () => {
      await updatePostImageGallery({ id: post.id, imagesGallery }).then(() => {
        toaster.toast({
          title: `Successfully uploaded images.`,
          variant: 'default'
        })
      })

      if (updateGallery) {
        setNewImages([])
        setUpdateGallery(false)
      }
    })
  }

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    imgUrl !== post.image && handleUpdateMetaData()
  }, [imgUrl])

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    if (updateGallery) {
      const images = [...(post.imagesGallery as MultiImage[]), ...(newImages ?? [])].filter(
        (item) => imagesToDelete && !imagesToDelete.includes(item)
      )

      handleUpdateImagesGallery(images)
    }
  }, [newImages, imagesToDelete])

  const url = siteConfig.url.home + '/' + post.page + '/' + post.slug

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Icons.settings className='h-4 w-4 text-slate-600' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[900px] overflow-y-scroll sm:max-w-[900px]'>
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
        <div className='flex items-center justify-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='slug'>Slug</Label>
            <div className='relative w-full'>
              <Input id='slug' placeholder='your-post-name' defaultValue={slug} onChange={(e) => setSlug(e.target.value)} />
              <Button
                type='submit'
                size='sm'
                className='absolute right-0 top-[1px] h-10 rounded-l px-3'
                onClick={() => handleUpdateMetaData()}
                disabled={isPendingSaving}
              >
                <span className='sr-only'>Save</span>
                <Icons.save className='h-4 w-4' />
              </Button>
            </div>
            <Label className='text-sm text-slate-600'>The slug is the URL-friendly version of the name. **e.g. your-post-name </Label>
          </div>
        </div>

        <Separator />
        <div className='min-h-[10rem] w-full space-y-2 '>
          <Label htmlFor='link'>Thumbnail image for your post. Accepted format: .png, .jpg, .jpeg</Label>
          <FileUpload value={imgUrl} onChange={(e) => setImgUrl(e)} />
        </div>

        <MultiImageUploader
          dataImages={{ images: post.imagesGallery as MultiImage[] }}
          newImages={newImages}
          setNewImages={setNewImages}
          imagesToDelete={imagesToDelete}
          setImagesToDelete={setImagesToDelete}
          setUpdateGallery={setUpdateGallery}
        />
      </DialogContent>
    </Dialog>
  )
}
