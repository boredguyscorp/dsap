import Link from 'next/link'
import { Post } from '@prisma/client'

import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PostOperations } from './post-operations'
import Badge from '@/components/custom/badge'
// import { PostOperations } from "@/components/post-operations"

interface PostItemProps {
  post: Pick<Post, 'id' | 'title' | 'slug' | 'published' | 'createdAt'>
  page: string
}

export function PostItem({ post, page }: PostItemProps) {
  return (
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
      <PostOperations post={post} page={page} />
    </div>
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
