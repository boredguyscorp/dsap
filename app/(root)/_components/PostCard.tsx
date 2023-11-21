import Link from 'next/link'

import type { Post } from '@prisma/client'
import BlurPostImage from './BlurPostImage'
import { imagePostEmpty, placeholderBlurhash, toDateString } from '@/lib/utils'
import { Pages } from '../(routes)/[page]/page'
// import postImage from 'public/images/post.png'

interface PostCardProps {
  data: Pick<Post, 'slug' | 'image' | 'imageBlurhash' | 'title' | 'description' | 'createdAt'>
  page: Pages
}

export default function PostCard({ data, page }: PostCardProps) {
  return (
    <Link href={`${page}/${data.slug}`}>
      <div className='ease overflow-hidden rounded-2xl border-2 border-stone-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800'>
        <BlurPostImage
          src={data.image ?? imagePostEmpty}
          alt={data.title ?? 'Blog Post'}
          width={500}
          height={400}
          className='h-64 w-full object-cover'
          placeholder='blur'
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className='h-40 border-t border-stone-200 px-5 py-8 dark:border-stone-700 dark:bg-black'>
          <h3 className='font-title text-xl font-medium tracking-wide  text-teal-600 dark:text-white'>{data.title}</h3>
          <p className='text-md my-2 truncate italic text-stone-600 dark:text-stone-400'>
            {data.description && data.description.length > 0 ? data.description : <br />}
          </p>
          <p className='my-2 text-sm text-stone-600 dark:text-stone-400'>Published {toDateString(data.createdAt)}</p>
        </div>
      </div>
    </Link>
  )
}
