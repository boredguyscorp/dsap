'use client'

import BlurPostImage from '@/app/(root)/_components/BlurPostImage'
import { MultiImage } from '@/components/editor/settings/multi-image-uploader'
import { Icons } from '@/components/shared/icons'
import { cn, imagePostEmpty, placeholderBlurhash } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery'
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css'

type ImagesProps = {
  imagesGallery: MultiImage[]
}

export default function ImagesGallery({ imagesGallery }: ImagesProps) {
  const items = useMemo(() => {
    return imagesGallery.map((img) => {
      return { original: img.url, thumbnail: img.url }
    })
  }, [])

  const [isMaximize, setIsMaximize] = useState(false)

  const imageGalleryRef = useRef<ImageGallery>(null)

  const onClickHandler = () => {
    imageGalleryRef?.current?.fullScreen()
    // imageGalleryRef?.current?.setState({ showThumbnail: false })
    // imageGalleryRef?.current?.setState({
    //   setShowThumbnail: (e: boolean) => {
    //     console.log(e)
    //   }
    // })

    // console.log(imageGalleryRef?.current?.state)

    setIsMaximize((state) => !state)
  }

  useEffect(() => {
    // try {
    if (!isMaximize) {
      imageGalleryRef?.current?.exitFullScreen()
    }
    // } catch (error) {
    //   console.log('🚀 -> useEffect -> error:', error)
    //   setIsMaximize(false)
    // }
  }, [isMaximize])

  return (
    <ImageGallery
      ref={imageGalleryRef}
      items={items}
      showThumbnails={isMaximize}
      showBullets
      lazyLoad
      showFullscreenButton
      showPlayButton={false}
      renderItem={(e) => renderItem(e, isMaximize)}
      onClick={() => {
        onClickHandler()
      }}
      renderFullscreenButton={(onClick, isFullScreen) => {
        // console.log('🚀 -> ImagesGallery -> isFullScreen:', isFullScreen)
        setIsMaximize(isFullScreen)
        return null
        // return (
        //   <div className='-mt-10 flex w-full justify-end'>
        //     {/* <button
        //       className='absolute bottom-0 z-50 h-10 w-28 bg-red-300'
        //       onClick={(e) => {
        //         onClick(e)

        //         setShowThumbnail((state) => !state)
        //       }}
        //     >
        //       Click Me
        //     </button> */}
        //     <button
        //       className='z-40 -mt-1 mb-4 mr-1 h-9 w-9 min-w-min items-center justify-center rounded-sm text-lg font-bold text-white transition duration-200 ease-in-out  hover:scale-125'
        //       onClick={(e) => {
        //         onClick(e)
        //         // setIsMaximize((state) => !state)
        //       }}
        //     >
        //       {isMaximize ? <Icons.minimize className='drop-shadow-md' /> : <Icons.maximize />}
        //     </button>
        //   </div>
        // )
      }}
    />
  )
}

function renderItem(item: ReactImageGalleryItem, isMaximize: boolean) {
  return (
    <div className='ease overflow-hidden border-2 border-stone-100 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800'>
      <BlurPostImage
        src={item.original ?? imagePostEmpty}
        alt={item.description ?? 'image'}
        blurDataURL={placeholderBlurhash}
        placeholder='blur'
        width={500}
        height={800}
        className={cn('h-[400px] w-full object-cover', isMaximize && 'h-[900px]')}
        {...(isMaximize && { style: { objectFit: 'contain', width: '100%' } })}
      />
      {/* <div className='image-gallery-description'>Testing Description</div> */}
    </div>
  )
}
