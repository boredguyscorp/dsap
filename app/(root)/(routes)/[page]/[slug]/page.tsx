import { getPostsForSite } from '@/actions/fetchers'
import BlurPostImage from '@/app/(root)/_components/BlurPostImage'
import { Icons } from '@/components/shared/icons'
import { cn, imagePostEmpty, placeholderBlurhash, toDateString, toProperCase } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'

import dyanmic from 'next/dynamic'

const ImagesGallery = dyanmic(() => import(`./images-gallery`), {
  loading: () => <h1 className='text-lg'>Loading Images...</h1>
})

const EditorHtmlContent = dyanmic(() => import('@/components/advance-text-editor/editor-html-content'), { ssr: false })

interface PostPageProps {
  params: {
    slug: string
    page: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { page, slug } = params

  const posts = await getPostsForSite(page)
  const post = posts.find((post) => post.slug === slug)
  const postReadingTime = post && post.content ? readingTime(post.content) : null

  const adjacentPosts = posts.filter((post) => post.slug !== slug)

  if (!post) {
    notFound()
  }

  const imagesGallery = post.imagesGallery as string[]
  const showBanner = process.env.SHOW_BANNER === 'true'

  return (
    <div className={cn('mx-auto mb-20 mt-24 min-h-screen max-w-[85rem] px-4 sm:px-6 lg:px-8', showBanner && 'mt-36')}>
      <div className='grid gap-y-8 md:gap-x-6 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0'>
        <div className='lg:col-span-2'>
          <div className='py-8 md:pr-4 lg:pr-8'>
            <div className='mb-10 space-y-3 lg:space-y-4'>
              <Link
                className='inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:text-teal-500'
                href={`/${page.toLowerCase()}`}
              >
                <Icons.chevronLeft className='mr-1 h-4 w-4' />
                Back to {toProperCase(page)}
              </Link>

              <h2 className='text-3xl font-bold text-teal-600 dark:text-white md:text-4xl lg:text-5xl'>{post.title}</h2>

              <div className='flex items-center gap-x-5'>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-sm'>
                  Published {toDateString(post.createdAt)}
                </div>
                {postReadingTime ? (
                  <div className='flex items-center gap-2 text-sm text-gray-800'>
                    <span>{postReadingTime.text}</span> <Icons.clock className='h-4 w-4 text-gray-500' />
                  </div>
                ) : null}
              </div>

              <div>
                <EditorHtmlContent value={post.description} />
              </div>
            </div>

            <div className='my-10'>{imagesGallery.length > 0 && <ImagesGallery imagesGallery={imagesGallery} />}</div>

            <div className='space-y-5 lg:space-y-8'>
              <EditorHtmlContent value={post.content} />
            </div>
          </div>
        </div>

        <div className=' dark:from-slate-800 lg:col-span-1 lg:h-full lg:w-full lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent'>
          <div className='sticky left-0 top-0 py-8 md:pl-4 lg:pl-8'>
            <div
              className={cn(
                'group mb-8 mt-20 flex items-center gap-x-3 border-b border-gray-200 pb-8 dark:border-gray-700'
                // showBanner && 'mt-36'
              )}
            >
              <div className='block grow'>
                <h5 className='text-lg font-bold text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>Related content</h5>
                <p className='text-sm text-gray-500'>and more {page} post.</p>
              </div>
            </div>

            <div className='space-y-6'>
              {adjacentPosts &&
                adjacentPosts.map((post) => (
                  <Link key={post.slug} className='group flex items-center gap-x-6' href={post.slug}>
                    <div className='grow'>
                      <span className='text-sm font-semibold text-teal-600 group-hover:text-teal-500 dark:text-gray-200 dark:group-hover:text-blue-500'>
                        {post.title}
                        <div className='line-clamp-4 font-light text-gray-500 [&>*]:text-xs'>
                          <EditorHtmlContent value={post.description} />
                        </div>
                      </span>
                    </div>

                    <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg'>
                      <BlurPostImage
                        src={post.image ?? imagePostEmpty}
                        alt={post.title ?? `${post.page} Post`}
                        fill
                        // width={50}
                        // height={50}
                        className='absolute left-0 top-0 h-full w-full rounded-lg object-cover'
                        placeholder='blur'
                        blurDataURL={post.imageBlurhash ?? placeholderBlurhash}
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

// export async function generateStaticParams() {
//   const posts = await getPostsForSite('event')

//   if (posts.length < 0) return []

//   return posts.map((post) => ({
//     slug: post.slug
//   }))
// }
