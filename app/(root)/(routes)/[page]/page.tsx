import React from 'react'

import PostCard from '../../_components/PostCard'
import { getPostsForSite } from '@/actions/fetchers'
import { notFound } from 'next/navigation'
import { PAGES } from '../../_constant/constant'
import { cn } from '@/lib/utils'

export default async function EventPage({ params }: { params: { page: string } }) {
  const page = PAGES.find((row) => row === params.page)

  if (!page) throw notFound()

  const posts = await getPostsForSite(page)
  const pageTitle = convertToTitleCase(page)

  const showBanner = process.env.SHOW_BANNER === 'true'

  return (
    // <div className='mb-20 mt-24 min-h-[calc((100vh-6rem))] w-full bg-yellow-500 px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
    <div
      className={cn('mx-auto mt-24 min-h-[calc((100vh-6rem))] max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14', showBanner && 'mt-32')}
    >
      {/* <ForceRefresh /> */}
      <div className='mb-10 max-w-[85rem]'>
        <h2 className='text-2xl font-bold dark:text-white md:text-4xl md:leading-tight'>{pageTitle}</h2>
        {/* <p className='mt-1 text-gray-600 dark:text-gray-400'>DSAP event and community service.</p> */}
      </div>
      {posts && posts.length > 0 ? (
        <div className='max-w-screen-xl 2xl:mx-auto'>
          <div className='grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
            {posts.map((metadata, index) => (
              <PostCard key={index} data={metadata} page={page} />
            ))}
          </div>
        </div>
      ) : (
        <>No {pageTitle} Post Found.</>
      )}
    </div>
  )
}

function convertToTitleCase(str: string) {
  if (!str) {
    return ''
  }
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase())
}
