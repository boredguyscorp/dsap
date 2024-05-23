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
  imagesGallery: string[]
}

export default function ImagesGallery({ imagesGallery }: ImagesProps) {
  const items = useMemo(() => {
    return imagesGallery.map((url) => {
      return { original: url, thumbnail: url }
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
    if (!isMaximize) {
      imageGalleryRef?.current?.exitFullScreen()
    }
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
        //   <div className='flex justify-end w-full -mt-10'>
        //     {/* <button
        //       className='absolute bottom-0 z-50 h-10 bg-red-300 w-28'
        //       onClick={(e) => {
        //         onClick(e)

        //         setShowThumbnail((state) => !state)
        //       }}
        //     >
        //       Click Me
        //     </button> */}
        //     <button
        //       className='z-40 items-center justify-center mb-4 mr-1 -mt-1 text-lg font-bold text-white transition duration-200 ease-in-out rounded-sm h-9 w-9 min-w-min hover:scale-125'
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
