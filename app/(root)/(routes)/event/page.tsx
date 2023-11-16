import React from 'react'

import type { Post } from '@prisma/client'

import PostCard from '../../_components/PostCard'
import { getPostsForSite } from '@/actions/fetchers'
// import { ForceRefresh } from '@/components/shared/force-refresh'

type PostCardData = Pick<Post, 'slug' | 'image' | 'imageBlurhash' | 'title' | 'description' | 'createdAt'>

// export const posts: PostCardData[] = [
//   {
//     title: 'BRIGADA ESKWELA',
//     slug: 'brigada-eskwela',
//     description: '"Bayanihan Para sa Matatag na Paaralan. Tara na, Magbrigada na Tayo"',
//     image: null,
//     imageBlurhash: null,
//     createdAt: new Date()
//   },
//   {
//     title: 'HEALING THE NATION',
//     slug: 'healing-the-nation',
//     description: '"Healing the Nation" commemorates the association`s foundation month of April each year."',
//     image: null,
//     imageBlurhash: null,
//     createdAt: new Date()
//   },
//   {
//     title: 'KALINGAN NI LOLO AT LOLA',
//     slug: 'healing-the-nation',
//     description: '"Kalinga Kay Lolo at Lola" (Caring for our Grandparents)"',
//     image: null,
//     imageBlurhash: null,
//     createdAt: new Date()
//   }
// ]

export default async function EventPage() {
  const posts = await getPostsForSite('event')
  // console.log('🚀 -> EventPage -> dbPost:', dbPost)

  // if (dbPost.length > 0) posts.push(...dbPost)

  return (
    // <div className='mb-20 mt-24 min-h-[calc((100vh-6rem))] w-full bg-yellow-500 px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
    <div className='mx-auto mt-24 min-h-[calc((100vh-6rem))] max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
      {/* <ForceRefresh /> */}
      <div className='mb-10 max-w-[85rem]'>
        <h2 className='text-2xl font-bold dark:text-white md:text-4xl md:leading-tight'>Event</h2>
        <p className='mt-1 text-gray-600 dark:text-gray-400'>DSAP event and community service.</p>
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
        <>No Static Post Found.</>
      )}
    </div>
  )
}
