'use client'

import { ElementRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

import { Icon, Icons } from './shared/icons'
import { useMounted } from '@/hooks/use-mounted'
import { byteFormatter, cn, getFileFromBlobUrl } from '@/lib/utils'
import { Input } from './ui/input'
import Image from 'next/image'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

type ImageUploaderProps = {
  label: string
  isRequired?: boolean
  className?: string
  uploaderKey: string
  icon: Icon
  limitSize: number // in MB
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  errorClassName?: string
} & (
  | { value: string; display: null; onChange: (url: string) => void; isMultiple: false }
  | { value: string[]; display: 'loose' | 'compact'; onChange: (url: string[]) => void; isMultiple: true }
)

type IsFileTypeValid = { files: File[]; isMultiple: true } | { file: File; isMultiple: false }
type IsFileTooBig = { files: File[]; limitSize: number; isMultiple: true } | { file: File; limitSize: number; isMultiple: false }

type HandleRemoveFile =
  | {
      url: string
      onChange: (url: string[]) => void
      files: { file: File; url: string }[]
      isMultiple: true
    }
  | {
      url: string
      onChange: (url: string) => void
      isMultiple: false
    }

export function ImageUploader({
  label,
  value,
  isRequired,
  uploaderKey,
  icon: Icon,
  limitSize,
  isLoading,
  isError,
  errorMessage,
  errorClassName,
  className,
  onChange,
  isMultiple,
  display
}: ImageUploaderProps) {
  const mounted = useMounted()

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; url: string }[]>([])
  const [isInitializingData, setIsInitializingData] = useState<boolean>(false)
  const [isInitializingDataError, setInitializingDataError] = useState<boolean>(false)
  const inputRef = useRef<ElementRef<'input'>>(null)

  const setInitialValue = async (value: string | string[]) => {
    try {
      if (typeof value === 'string') {
        setIsInitializingData(true)

        const file = await getFileFromBlobUrl(value)
        setUploadedFiles([{ file, url: value }])

        setIsInitializingData(false)
        return
      }

      if (Array.isArray(value) && value.length > 0) {
        setIsInitializingData(true)

        const initialUploadedFiles: { file: File; url: string }[] = []

        for (const v of value) {
          const file = await getFileFromBlobUrl(v)
          initialUploadedFiles.push({ file, url: v })
        }

        setUploadedFiles(initialUploadedFiles)
        setIsInitializingData(false)
      }
    } catch (error) {
      console.error('INITIALIZING_DATA_ERROR', error)
      setInitializingDataError(true)
      setIsInitializingData(false)
    }
  }

  useEffect(() => {
    if (value) setInitialValue(value)

    return () => {
      setUploadedFiles([])
      setIsInitializingData(false)
    }
  }, [])

  if (!mounted) return null

  const isFileTypeValid = (params: IsFileTypeValid) => {
    if (!params.isMultiple) {
      const file = params.file
      return file.type.includes('image/')
    }

    return params.files.every((file) => file.type.includes('image/'))
  }

  const isFileTooBig = (params: IsFileTooBig) => {
    if (!params.isMultiple) {
      const file = params.file
      return file.size / 1024 / 1024 >= limitSize
    }

    return !params.files.every((file) => file.size / 1024 / 1024 <= limitSize)
  }

  const handleRemoveFile = (params: HandleRemoveFile) => {
    if (!params.isMultiple) {
      URL.revokeObjectURL(params.url) // clean up
      params.onChange('')
      setUploadedFiles([])

      if (inputRef && inputRef.current) inputRef.current.value = ''
      return
    }

    const fileIndex = params.files.findIndex((file) => file.url === params.url)

    if (fileIndex || fileIndex === 0) {
      URL.revokeObjectURL(params.url) // clean up
      params.files.splice(fileIndex, 1)
      params.onChange(params.files.map((file) => file.url))
      setUploadedFiles(params.files)

      if (inputRef && inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDragEvent = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    if (e.type === 'dragleave' || e.type === 'drop') setIsDragging(false)

    if (e.type === 'drop') {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (!isMultiple) {
          const file = e.dataTransfer.files[0]

          if (!file) return

          // check if file is image
          if (!isFileTypeValid({ file, isMultiple })) {
            toast.error('File type not supported', {
              description: 'Image file types are only allowed.',
              duration: 5000
            })
            e.currentTarget.value = ''
            return
          }

          // check if file less than or equal 4 MB
          else if (isFileTooBig({ file, isMultiple, limitSize })) {
            toast.error('File size too big', { description: `The file size should be less than or equal ${limitSize} MB`, duration: 5000 })
            e.currentTarget.value = ''
            return
          }

          const url = URL.createObjectURL(file)

          setUploadedFiles([{ file, url }])
          onChange(url)
          setInitializingDataError(false)
          return
        }

        //?: when files are selected/drag & drop they will not be order based on what first is selected, which the browser automatically order them natively which cannot be controlled
        //TODO after selecting/ drag & dropiing files allow the uploaded files to order by dragging the over, use packag for drop & drop for list: @hello-pangea/dnd -> https://www.npmjs.com/package/@hello-pangea/dnd

        const files = Array.from(e.dataTransfer.files)

        if (files.length < 1) return

        // check if file is image
        if (!isFileTypeValid({ files, isMultiple })) {
          toast.error('File type not supported', {
            description: 'Uploaded files contains unsupported file type. Image file types are only allowed.',
            duration: 5000
          })
          e.currentTarget.value = ''
          return
        }

        // check if file less than or equal 4 MB
        else if (isFileTooBig({ files, isMultiple, limitSize })) {
          toast.error('File size too big', {
            description: `Uploaded files contains a file that is too big. The file size should be less than or equal ${limitSize} MB`,
            duration: 5000
          })
          e.currentTarget.value = ''
          return
        }

        const FilesWithUrl = files.map((file) => ({ file, url: URL.createObjectURL(file) }))

        setUploadedFiles(FilesWithUrl)
        onChange(FilesWithUrl.map((file) => file.url))
        setInitializingDataError(false)
      }
    }
  }

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!isMultiple) {
        const file = e.target.files[0]

        if (!file) return

        // check if file is image
        if (!isFileTypeValid({ file, isMultiple })) {
          toast.error('File type not supported', {
            description: 'Image file types are only allowed.',
            duration: 5000
          })
          e.currentTarget.value = ''
          return
        }

        // check if file less than or equal 4 MB
        else if (isFileTooBig({ file, isMultiple, limitSize })) {
          toast.error('File size too big', { description: `The file size should be less than or equal ${limitSize} MB`, duration: 5000 })
          e.currentTarget.value = ''
          return
        }

        const url = URL.createObjectURL(file)

        setUploadedFiles([{ file, url }])
        onChange(url)
        return
      }

      //?: when files are selected/drag & drop they will not be order based on what first is selected, which the browser automatically order them natively which cannot be controlled
      //TODO after selecting/ drag & dropiing files allow the uploaded files to order by dragging the over, use packag for drop & drop for list: @hello-pangea/dnd -> https://www.npmjs.com/package/@hello-pangea/dnd

      const files = Array.from(e.target.files)

      if (files.length < 1) return

      // check if file is image
      if (!isFileTypeValid({ files, isMultiple })) {
        toast.error('File type not supported', {
          description: 'Uploaded files contains unsupported file type. Image file types are only allowed.',
          duration: 5000
        })
        e.currentTarget.value = ''
        return
      }

      // check if file less than or equal 4 MB
      else if (isFileTooBig({ files, isMultiple, limitSize })) {
        toast.error('File size too big', {
          description: `Uploaded files contains a file that is too big. The file size should be less than or equal ${limitSize} MB`,
          duration: 5000
        })
        e.currentTarget.value = ''
        return
      }

      const FilesWithUrl = files.map((file) => ({ file, url: URL.createObjectURL(file) }))

      setUploadedFiles(FilesWithUrl)
      onChange(FilesWithUrl.map((file) => file.url))
    }
  }

  return (
    <div className={cn('flex flex-col items-stretch justify-stretch gap-1')}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-2',
          uploadedFiles.length > 0 && !isMultiple && 'border-none',
          (isError || isInitializingDataError) && 'border-red-400',
          isDragging && 'border-teal-500',
          className
        )}
      >
        <div className='relative flex h-full w-full items-center justify-center'>
          <>
            <div className='flex flex-col items-center gap-3'>
              <Icon className='block h-8 w-8 text-teal-500' />

              {!isDragging ? (
                <div className='flex flex-col items-center justify-center gap-1'>
                  <p className='text-center text-sm font-medium text-teal-500'>Choose {isMultiple ? 'files' : 'file'} or drag and drop</p>
                  <p className={cn('text-center text-sm font-medium', isError && 'text-destructive')}>
                    {label} {isRequired && '*'}
                  </p>
                  <p className='text-center text-xs text-gray-500'>image (Max {limitSize}MB)</p>
                  {isInitializingDataError ? (
                    <p className='mt-2 flex items-center gap-1.5 text-center text-xs text-destructive'>
                      <Icons.error className='block h-4 w-4 text-destructive' /> Error loading {isMultiple ? 'images' : 'image'}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {isDragging ? (
                <p className='text-center text-sm font-medium text-teal-500'>Drop the {isMultiple ? 'files' : 'file'} here</p>
              ) : null}
            </div>

            <Input
              id={`${uploaderKey}-file-uploader`}
              disabled={isLoading || isInitializingData}
              ref={inputRef}
              className='absolute z-20 block h-full cursor-pointer text-xs !opacity-0'
              type='file'
              onChange={handleChangeEvent}
              onDragEnter={handleDragEvent}
              onDragOver={handleDragEvent}
              onDragLeave={handleDragEvent}
              onDrop={handleDragEvent}
              multiple={isMultiple}
              accept='image/*'
            />
          </>

          {uploadedFiles.length === 1 && !isMultiple && (
            <>
              <span
                onClick={() => handleRemoveFile({ url: uploadedFiles[0].url, isMultiple, onChange })}
                title='Remove Image'
                className='absolute -right-1.5 -top-2 z-[60] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 object-center text-white'
              >
                <Icons.close className='h-4 w-4' />
              </span>
              <Image
                fill
                src={uploadedFiles[0].url}
                alt={uploadedFiles[0].file.name}
                className='absolute z-50 block h-full w-full rounded-md'
              />
            </>
          )}
        </div>

        {isLoading || isInitializingData ? (
          <div className='absolute flex h-full w-full items-center justify-center opacity-50'>
            <Icons.spinner className='z-20 h-10 w-10 animate-spin text-black' />
            <div className='absolute z-10 h-full w-full bg-black opacity-50'></div>
          </div>
        ) : null}
      </div>

      {isError && errorMessage ? (
        <p className={cn('inline-block w-full text-wrap text-sm font-medium text-destructive', errorClassName)}>{errorMessage}</p>
      ) : null}

      {isMultiple && display && display === 'loose' && !isLoading && !isInitializingData && uploadedFiles.length > 0 ? (
        <ScrollArea
          className={cn('mt-1 w-full', !isMultiple && uploadedFiles.length > 0 && 'h h-[64px]')}
          viewPortClassName={cn(isMultiple && 'min-h-[79px] max-h-[280px]')}
        >
          <div className='flex flex-col gap-1.5'>
            {uploadedFiles.map((obj, i) => (
              <div key={i} className='flex w-full items-center justify-between gap-3 rounded-md bg-teal-50 p-3'>
                <div className='h-16 w-16 flex-shrink-0 '>
                  <img src={obj.url} alt={obj.file.name} className='h-full w-full rounded-md' />
                </div>
                <div className='flex w-full min-w-[100px] flex-col gap-1'>
                  <Link href={obj.url} target='_blank' className='line-clamp-1 w-full min-w-[100px] text-xs hover:underline'>
                    {obj.file.name}
                  </Link>

                  <p className='text-xs text-gray-500'>{byteFormatter.format(obj.file.size)}</p>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => {
                    if (!isMultiple) {
                      handleRemoveFile({ url: obj.url, isMultiple, onChange })
                      return
                    }

                    handleRemoveFile({ url: obj.url, isMultiple, files: uploadedFiles, onChange })
                  }}
                >
                  <Icons.trash className='h-5 w-5 text-destructive' />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}

      {isMultiple && display && display === 'compact' && !isLoading && !isInitializingData && uploadedFiles.length > 0 ? (
        <ScrollArea className='mt-1 w-full' viewPortClassName={cn(isMultiple && 'min-h-[104px] max-h-[200px]')}>
          <div className='mt-1 flex w-full flex-wrap gap-4 bg-teal-50 p-3'>
            {uploadedFiles.map((obj, i) => (
              <div key={i} className='relative flex w-fit flex-col items-center gap-1.5'>
                <Link href={obj.url} target='_blank'>
                  <img src={obj.url} alt={obj.file.name} className='h-20 w-20 rounded-md' />
                </Link>

                <span
                  className='absolute -right-1.5 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500'
                  onClick={() => {
                    if (!isMultiple) {
                      handleRemoveFile({ url: obj.url, isMultiple, onChange })
                      return
                    }

                    handleRemoveFile({ url: obj.url, isMultiple, files: uploadedFiles, onChange })
                  }}
                >
                  <Icons.close className='h-4 w-4 text-white' />
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}
