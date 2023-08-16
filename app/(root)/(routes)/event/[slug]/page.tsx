import { getPostData } from '@/actions/fetchers'
import BlurPostImage from '@/app/(root)/_components/BlurPostImage'
import EditorOutput from '@/components/custom/EditorOutput'
import MDX from '@/components/mdx'
import { Icons } from '@/components/shared/icons'
import { placeholderBlurhash, toDateString } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function EventPagePost({ params }: PostPageProps) {
  const slug = params.slug

  const data = await getPostData('event', slug)

  if (!data) {
    notFound()
  }

  return (
    <div className='mx-auto mb-20 mt-24 max-w-[85rem] px-4 sm:px-6 lg:px-8'>
      <div className='grid gap-y-8 md:gap-x-6 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0'>
        <div className='lg:col-span-2'>
          <div className='py-8 md:pr-4 lg:pr-8'>
            <div className='mb-10 space-y-3 lg:space-y-4'>
              <Link className='inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:text-teal-500' href='/event'>
                <Icons.chevronLeft className='mr-1 h-4 w-4' />
                Back to Event
              </Link>

              <h2 className='text-3xl font-bold dark:text-white md:text-4xl lg:text-5xl'>{data.title}</h2>

              <p className='text-lg text-gray-800 dark:text-gray-200'>{data.description}</p>

              <div className='flex items-center justify-between gap-x-5'>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-sm'>
                  Tags or Category here.
                </div>
                <p className='text-xs text-gray-800 dark:text-gray-200 sm:text-sm'>Published {toDateString(data.createdAt)}</p>
              </div>
            </div>

            <div className='space-y-5 lg:space-y-8'>
              <MDX source={data.mdxSource} />

              {/* <EditorOutput content={data.content} /> */}
            </div>
          </div>
        </div>

        <div className=' dark:from-slate-800 lg:col-span-1 lg:h-full lg:w-full lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent'>
          <div className='sticky left-0 top-0 py-8 md:pl-4 lg:pl-8'>
            <div className='group mb-8 mt-20 flex items-center gap-x-3 border-b border-gray-200 pb-8 dark:border-gray-700'>
              <a className='group block grow' href=''>
                <h5 className='text-lg font-bold text-gray-800 group-hover:text-gray-600 dark:text-gray-200 dark:group-hover:text-gray-400'>
                  Related content
                </h5>
                <p className='text-sm text-gray-500'>and more event post.</p>
              </a>
            </div>

            <div className='space-y-6'>
              {data.adjacentPosts &&
                data.adjacentPosts.map((data, index) => (
                  <Link key={data.slug} className='group flex items-center gap-x-6' href={data.slug}>
                    <div className='grow'>
                      <span className='text-sm font-semibold text-gray-800 group-hover:text-teal-500 dark:text-gray-200 dark:group-hover:text-blue-500'>
                        {data.title}
                        <p className='text-xs font-light text-gray-500'>{data.description}</p>
                      </span>
                    </div>

                    <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg'>
                      <BlurPostImage
                        src={data.image!}
                        alt={data.title ?? `${data.page} Post`}
                        fill
                        // width={50}
                        // height={50}
                        className='absolute left-0 top-0 h-full w-full rounded-lg object-cover'
                        placeholder='blur'
                        blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
                      />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
