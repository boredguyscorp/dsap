'use client'

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

import { UploadDropzone } from '@/lib/uploadthing'

import '@uploadthing/react/styles.css'
import { useToast } from '@/components/ui/use-toast'

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string | null | undefined
}

export const FileUpload = ({ onChange, value }: FileUploadProps) => {
  const fileType = value?.split('.').pop()

  const toaster = useToast()

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-full w-full '>
        <Image fill src={value} alt='Upload' className='rounded-sm' />
        <button
          onClick={() => onChange(undefined)}
          className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  //   if (value && fileType === 'pdf') {
  //     return (
  //       <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
  //         <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
  //         <a
  //           href={value}
  //           target='_blank'
  //           rel='noopener noreferrer'
  //           className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
  //         >
  //           {value}
  //         </a>
  //         <button
  //           onClick={() => onChange('')}
  //           className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
  //           type='button'
  //         >
  //           <X className='h-4 w-4' />
  //         </button>
  //       </div>
  //     )
  //   }

  return (
    <UploadDropzone
      endpoint='imageUploader'
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
        toaster.toast({
          title: `Error uploading image.`,
          description: error.message,
          variant: 'destructive'
        })
      }}
    />
  )
}
