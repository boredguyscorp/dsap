'use client'

import { updateMetaDataSettings } from '@/actions/post'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Post } from '@prisma/client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { FileUpload } from './file-upload'
import { Separator } from '@/components/ui/separator'

type PostSettingsProps = Pick<Post, 'id' | 'slug' | 'image'>

export function SettingsDialog({ post }: { post: PostSettingsProps }) {
  const [slug, setSlug] = useState<string>(post.slug)
  const [imgUrl, setImgUrl] = useState<string | null | undefined>(post.image)

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

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    handleUpdateMetaData()
  }, [imgUrl])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant='outline'>Edit Profile</Button> */}
        <Button variant='ghost' size='icon'>
          <Icons.settings className='h-4 w-4 text-slate-600' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Make changes to your post. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link'>Slug</Label>
            <Input id='link' placeholder='your-post-name' defaultValue={slug} onChange={(e) => setSlug(e.target.value)} />
            <Label className='text-sm text-slate-600'>The slug is the URL-friendly version of the name. **e.g. your-post-name </Label>
          </div>
          <Button type='submit' size='sm' className='px-3' onClick={() => handleUpdateMetaData()} disabled={isPendingSaving}>
            <span className='sr-only'>Save</span>
            <Icons.save className='h-4 w-4' />
          </Button>
        </div>
        <Separator />
        <div className='h-96 w-full space-y-2 pb-6'>
          <Label htmlFor='link'>Thumbnail image for your post. Accepted formats: .png, .jpg, .jpeg</Label>
          <FileUpload value={imgUrl} onChange={(e) => setImgUrl(e)} />
        </div>
        {/* <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
