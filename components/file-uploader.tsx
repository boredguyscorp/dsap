'use client'

import { ElementRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

import { MimeType, mimeTypesInternal } from '@/lib/mime-db'
import { Icon, Icons } from './shared/icons'
import { useMounted } from '@/hooks/use-mounted'
import { byteFormatter, cn, getFileFromBlobUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

type FileUploaderProps = {
  label: string
  isRequired?: boolean
  className?: string
  uploaderKey: string
  icon: Icon
  limitSize: number // in MB
  type: MimeType[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  errorClassName?: string
} & (
  | { value: string; onChange: (url: string) => void; isMultiple: false }
  | { value: string[]; onChange: (url: string[]) => void; isMultiple: true }
)

type IsFileTypeValid = { files: File[]; type: MimeType[]; isMultiple: true } | { type: MimeType[]; file: File; isMultiple: false }
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

/**
 *  FileUploader Component upload files based on specified file type
 */

export function FileUploader({
  label,
  value,
  isRequired,
  uploaderKey,
  icon: Icon,
  type,
  limitSize,
  isLoading,
  isError,
  errorMessage,
  errorClassName,
  className,
  onChange,
  isMultiple
}: FileUploaderProps) {
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
      return params.type.includes(file.type as MimeType)
    }

    return params.files.every((file) => params.type.includes(file.type as MimeType))
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
          if (!isFileTypeValid({ file, type, isMultiple })) {
            toast.error('File type not supported', {
              description: `The file ${type.toString().split(',').join(', ')} types are only allowed.`,
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
        if (!isFileTypeValid({ files, type, isMultiple })) {
          toast.error('File type not supported', {
            description: `Uploaded files contains unsupported file type. The file ${type
              .toString()
              .split(',')
              .join(', ')} types are only allowed.`,
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
        if (!isFileTypeValid({ file, type, isMultiple })) {
          toast.error('File type not supported', {
            description: `The file ${type.toString().split(',').join(', ')} types are only allowed.`,
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

      const files = Array.from(e.target.files)

      if (files.length < 1) return

      // check if file is image
      if (!isFileTypeValid({ files, type, isMultiple })) {
        toast.error('File type not supported', {
          description: `Uploaded files contains unsupported file type. The file ${type
            .toString()
            .split(',')
            .join(', ')} types are only allowed.`,
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

  const getFileExtension = (type: MimeType[]) => {
    const extensions = type.map((type) => mimeTypesInternal[type].extensions)
    return extensions.flat(Infinity).toString().split(',').join(', ')
  }

  return (
    <div className={cn('flex flex-col items-stretch justify-stretch gap-1')}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-2',
          isDragging && 'border-teal-500',
          isError && 'border-red-400',
          className
        )}
      >
        <div className='relative flex h-full w-full items-center justify-center'>
          <div className='flex flex-col items-center gap-3'>
            <Icon className='block h-10 w-10 text-teal-500' />
            {!isDragging ? (
              <div className='flex flex-col items-center justify-center gap-1'>
                <p className='text-center text-base font-medium text-teal-500'>Choose {isMultiple ? 'files' : 'file'} or drag and drop</p>
                <p className={cn('text-center text-sm font-medium', isError && 'text-red-400')}>
                  {label} {isRequired && '*'}
                </p>
                <p className='text-center text-xs text-gray-500'>
                  {getFileExtension(type)} (Max {limitSize}MB)
                </p>
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
            className='absolute block h-full cursor-pointer text-xs !opacity-0'
            type='file'
            onChange={handleChangeEvent}
            onDragEnter={handleDragEvent}
            onDragOver={handleDragEvent}
            onDragLeave={handleDragEvent}
            onDrop={handleDragEvent}
            multiple={isMultiple}
            accept={type.toString()}
          />
        </div>

        {isLoading || isInitializingData ? (
          <div className='absolute flex h-full w-full items-center justify-center opacity-50'>
            <Icons.spinner className='z-20 h-10 w-10 animate-spin text-black' />
            <div className='absolute z-10 h-full w-full bg-black opacity-50'></div>
          </div>
        ) : null}
      </div>

      {isError && errorMessage ? <p className={cn('text-sm font-medium text-destructive', errorClassName)}>{errorMessage}</p> : null}

      {!isLoading && !isInitializingData && uploadedFiles.length > 0 ? (
        <ScrollArea
          className={cn('mt-1 w-full', !isMultiple && uploadedFiles.length > 0 && 'h-[64px]')}
          viewPortClassName={cn(isMultiple && 'min-h-[79px] max-h-52')}
        >
          <div className='flex h-full flex-col gap-1.5'>
            {uploadedFiles.map((obj, i) => (
              <div key={i} className='flex w-full items-center justify-center gap-3 rounded-md bg-teal-50 p-3'>
                <Icons.file className='h-6 w-6 flex-shrink-0 text-teal-500' />
                <div className='w-full'>
                  <Link href={obj.url} target='_blank' className='line-clamp-1 w-full text-xs hover:underline'>
                    {obj.file.name}
                  </Link>
                  <p className='text-xs text-gray-500'>{byteFormatter.format(obj.file.size)}</p>
                </div>
                <Button
                  variant='ghost'
                  type='button'
                  onClick={() => {
                    if (!isMultiple) {
                      handleRemoveFile({ url: obj.url, isMultiple, onChange })
                      return
                    }

                    handleRemoveFile({ url: obj.url, isMultiple, files: uploadedFiles, onChange })
                  }}
                >
                  <Icons.trash className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}
