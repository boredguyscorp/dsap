import Link from 'next/link'
import { Post } from '@prisma/client'

import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PostOperations } from './post-operations'
import Badge from '@/components/custom/badge'
import { Icons } from '@/components/shared/icons'
import { siteConfig } from '@/app/config'
import PostSettingsDialog from '@/components/editor/settings/post-settings2'

interface PostItemProps {
  post: Pick<Post, 'id' | 'title' | 'slug' | 'published' | 'createdAt' | 'image' | 'imagesGallery' | 'page'>
  page: string
}

export function PostItem({ post, page }: PostItemProps) {
  return (
    <>
      <div className='flex items-center justify-between p-4'>
        <div className='grid gap-1'>
          <Link href={`/post/${post.id}?page=${page}`} className='font-semibold hover:underline'>
            {post.title}
          </Link>
          <div className='flex items-center space-x-3'>
            <p className='text-sm text-muted-foreground'>{formatDate(post.createdAt?.toDateString())}</p>
            <Badge text={post.published ? 'Publish' : 'Draft'} variant={post.published ? 'black' : 'outline'} />
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <Link href={`${siteConfig.url.home}/${page}/${post.slug}`} target='_blank' rel='noreferrer'>
            <Icons.link className='h-4 w-4' />
          </Link>

          <PostOperations post={post} page={page} />
        </div>
      </div>
    </>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className='p-4'>
      <div className='space-y-3'>
        <Skeleton className='h-5 w-2/5' />
        <Skeleton className='h-4 w-4/5' />
      </div>
    </div>
  )
}
