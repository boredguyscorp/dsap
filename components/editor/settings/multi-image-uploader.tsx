'use client'
import { useDropzone } from 'react-dropzone'
import type { FileWithPath } from 'react-dropzone'

import { useCallback, useState } from 'react'

import { generateClientDropzoneAccept } from 'uploadthing/client'
import Image from 'next/image'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import { Label } from '@/components/ui/label'

export type MultiImage = {
  id: string
  alt: string
  url: string
}

export function MultiImageUploader(props: {
  dataImages: { images: MultiImage[] }
  newImages: MultiImage[]
  setNewImages: React.Dispatch<React.SetStateAction<MultiImage[]>>
  imagesToDelete: MultiImage[]
  setImagesToDelete: React.Dispatch<React.SetStateAction<MultiImage[]>>
  setUpdateGallery: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image'])
  })

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing('imageUploader', {
    onClientUploadComplete: (data) => {
      setFiles([])
      if (!data) return
      props.setNewImages(
        data.map((item) => {
          return {
            url: item.url,
            alt: item.key.split('_')[1],
            id: item.key
          }
        })
      )

      props.setUpdateGallery(true)
    },
    onUploadError: () => {
      toast({
        title: 'Sorry, an error occurred while uploading your image(s).'
      })
    }
  })

  return (
    <div>
      <Label htmlFor='dataImages-images'>Images Gallery</Label>
      <div className='mt-2 flex flex-wrap items-center justify-start gap-2 rounded-md border border-border p-4'>
        {[...props.dataImages.images, ...props.newImages]
          .filter((item) => !props.imagesToDelete.includes(item))
          .map((image) => (
            <div key={image.id}>
              <li className='relative h-36 w-36'>
                <Image src={image.url} alt={image.alt ?? ''} fill className='h-36 w-36 object-cover' />
                <button
                  type='button'
                  onClick={() => {
                    props.setImagesToDelete((prev) => [...prev, image])
                    props.setUpdateGallery(true)
                  }}
                  className='relative -top-4 ml-28 flex h-6 w-6 items-center justify-center rounded-full bg-white'
                >
                  <XIcon className='h-5 w-5' />
                </button>
              </li>
            </div>
          ))}
        <div {...getRootProps()} className='h-36 w-36 rounded-md border-2 border-dashed border-border'>
          <p className='relative top-[50px] flex flex-col items-center justify-center text-sm'>
            <span className='mr-1 font-semibold'>Click to upload</span>
            <span>or drag and drop.</span>
            <span className='text-xs text-muted-foreground'>(Max {permittedFileInfo?.config.image?.maxFileSize})</span>
          </p>
          <input
            id='dataImages-images'
            className='relative z-10 h-[100px] w-full border-2 opacity-0'
            {...getInputProps()}
            style={{ display: 'block' }}
          />
        </div>
      </div>
      {files.length > 0 && (
        <div className='mt-4'>
          {files.map((file, i) => (
            <li key={i}>
              {file.name} - {file.size} bytes
              {/* <Button
                type="button"
                variant="link"
                onClick={() => {
                  files.splice(i, 1);
                  // re-render not working
                }}
              >
                Remove
              </Button> */}
            </li>
          ))}
          <Button disabled={isUploading} className='mt-2' onClick={() => startUpload(files)} type='button'>
            {`${isUploading ? 'Uploading' : 'Upload'} ${files.length} file${files.length > 1 ? 's' : ''}${isUploading ? '...' : ''}`}
          </Button>
        </div>
      )}
    </div>
  )
}
