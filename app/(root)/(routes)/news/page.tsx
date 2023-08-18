import React from 'react'
import PostCard from '../../_components/PostCard'
import { getPostsForSite } from '@/actions/fetchers'
// import { ForceRefresh } from '@/components/shared/force-refresh'

// export const dynamic = 'force-dynamic'

export default async function EventPage() {
  const posts = await getPostsForSite('event')

  return (
    // <div className='mb-20 mt-24 min-h-[calc((100vh-6rem))] w-full bg-yellow-500 px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
    <div className='mx-auto mt-24 min-h-[calc((100vh-6rem))] max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
      {/* <ForceRefresh /> */}
      <div className='mb-10 max-w-[85rem]'>
        <h2 className='text-2xl font-bold dark:text-white md:text-4xl md:leading-tight'>News</h2>
        <p className='mt-1 text-gray-600 dark:text-gray-400'>
          Se non voluptate aliud pullum neglegendi maximas comitetur est positum quamquam esse licebit peripateticis tamen quae abducas
          profuit cum odit.
        </p>
      </div>
      {posts && posts.length > 0 ? (
        <div className='max-w-screen-xl 2xl:mx-auto'>
          <div className='grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
            {posts.map((metadata, index) => (
              <PostCard key={index} data={metadata} page='event' />
            ))}
          </div>
        </div>
      ) : (
        <>No Post Found.</>
      )}
    </div>
  )
}
