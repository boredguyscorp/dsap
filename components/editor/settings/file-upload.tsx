'use client'

import { FileIcon, FileText, X } from 'lucide-react'
import Image from 'next/image'

import { UploadDropzone } from '@/lib/uploadthing'

import '@uploadthing/react/styles.css'
import { useToast } from '@/components/ui/use-toast'
import { OurFileRouter } from '@/app/api/uploadthing/core'

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string | null | undefined
  endpoint?: keyof OurFileRouter
}

export const FileUpload = ({ onChange, value, endpoint = 'imageUploader' }: FileUploadProps) => {
  const fileType = value?.split('.').pop()

  const toaster = useToast()

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-96 w-full '>
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

  if (value && fileType === 'pdf') {
    return (
      <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
        <FileText className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
        >
          {/* {value} */}
          PDF - Click here to see attachment.
        </a>
        <button
          onClick={() => onChange('')}
          className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // console.log('🚀 -> onClientUploadComplete -> res:', res)
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        // console.log(error)
        let message = error.message

        if (message.includes('limit') && endpoint === 'pdfUploader') {
          message = 'PDF file up to 4MB only, maximum of 1 file.'
        }

        toaster.toast({
          title: `Error uploading files.`,
          description: message,
          variant: 'destructive'
        })
      }}
    />
  )
}
