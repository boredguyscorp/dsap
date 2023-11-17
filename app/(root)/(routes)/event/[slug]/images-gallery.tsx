'use client'

import { MultiImage } from '@/components/editor/settings/multi-image-uploader'
import ImageGallery from 'react-image-gallery'
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css'

type ImagesProps = {
  imagesGallery: MultiImage[]
}

export default function ImagesGallery({ imagesGallery }: ImagesProps) {
  const items = imagesGallery.map((img) => {
    return { original: img.url, thumbnail: img.url }
  })

  return <ImageGallery items={items} />
}
