import { notFound, redirect } from 'next/navigation'
import { Post, User } from '@prisma/client'

import { authOptions } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'
import db from '@/lib/db'
import { Editor } from '@/components/custom/Editor'
import { siteConfig } from '@/app/config'

async function getPostForUser(postId: Post['id'], userId: User['id']) {
  return await db.post.findFirst({
    where: {
      id: postId,
      authorId: userId
    }
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(siteConfig.url.app.signin)
  }

  const post = await getPostForUser(params.postId, user.id)
  // console.log('🚀 -> EditorPage -> post:', post)

  if (!post) {
    notFound()
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        published: post.published
      }}
    />
  )
}
