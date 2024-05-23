import { notFound, redirect } from 'next/navigation'
import Editor from '@/components/editor'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import PostForm from './_components/PostForm'

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getCurrentUser()
  if (!session) {
    redirect('/sign-in')
  }
  const data = await db.post.findUnique({
    where: {
      id: params.id
    }
  })

  if (!data || data.authorId !== session.id) {
    notFound()
  }

  return <PostForm post={data} />
}
