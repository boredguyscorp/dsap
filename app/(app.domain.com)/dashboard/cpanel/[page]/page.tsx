import { SidebarShell, SidebarShellHeader } from '@/app/(app.domain.com)/_components/dashboard-shell'
import { siteConfig } from '@/app/config'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { PostItem } from './post-item'
import { EmptyPlaceholder } from '@/components/empty-placeholder'
import { PostCreateButton } from './post-create-button'
import { toProperCase } from '@/lib/utils'
import { Icons } from '@/components/shared/icons'
import Link from 'next/link'

interface PageProps {
  params: {
    page: string
  }
}

export default async function CPanelContentPage({ params }: PageProps) {
  const user = await getCurrentUser()
  const page = params.page

  if (!user) {
    redirect(siteConfig.url.app.signin)
  }

  const posts = await db.post.findMany({
    where: {
      AND: { authorId: user.id, page }
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
      slug: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <SidebarShell>
      <SidebarShellHeader heading={toProperCase(page) + ' Post'} text='Create and manage post.'>
        <div className='flex space-x-2'>
          <Link
            href={siteConfig.url.home + `/${page}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center truncate rounded-md bg-accent px-4 py-1 text-sm font-medium transition-colors hover:bg-slate-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
          >
            {siteConfig.url.homeWithoutApp + `/${page}`} <Icons.link className='ml-2 h-4 w-4 ' />
          </Link>
          <PostCreateButton page={page} />
        </div>
      </SidebarShellHeader>
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
    </SidebarShell>
  )

  // return <div className='flex flex-col gap-2'>{params.page}</div>
}
