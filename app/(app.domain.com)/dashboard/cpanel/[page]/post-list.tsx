'use client'

import { memo } from 'react'
import { Post } from '@prisma/client'

import { PostItem } from './post-item'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { PostCreateButton } from './post-create-button'

interface PostListProps {
  posts: Pick<Post, 'id' | 'title' | 'slug' | 'published' | 'createdAt' | 'image' | 'imagesGallery' | 'page'>[]
  page: string
}

const Postlist = memo(function PostList({ posts, page }: PostListProps) {
  return (
    <div>
      {posts?.length ? (
        <div className='divide-y divide-border rounded-md border'>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} page={page} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name='post' />
          <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>You don&apos;t have any posts yet. Start creating content.</EmptyPlaceholder.Description>
          <PostCreateButton variant='outline' page={page} />
        </EmptyPlaceholder>
      )}
    </div>
  )
})

export default Postlist
