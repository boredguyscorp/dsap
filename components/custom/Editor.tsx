'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Post } from '@prisma/client'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { uploadFiles } from '@/lib/uploadthing'

import * as z from 'zod'

import '../../app/editor.css'
import { cn, slugify } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { postPatchSchema } from '@/lib/schema'
import { Icons } from '../shared/icons'
import Badge from './badge'

interface EditorProps {
  post: Pick<Post, 'id' | 'title' | 'description' | 'content' | 'published'>
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema)
  })

  const searchParams = useSearchParams()
  const page = searchParams?.get('page')

  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    const body = postPatchSchema.parse(post)

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({ endpoint: 'imageUploader', files: [file] })

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl
                    }
                  }
                }
              }
            }
          }
        }
      })
    }
  }, [post])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const state: { button: 'save' | 'publish' | 'unpublish' } = {
    button: 'save'
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const blocks = await ref.current?.save()

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        content: blocks,
        isPublish: state.button === 'publish'
      })
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your post was not saved. Please try again.',
        variant: 'destructive'
      })
    }

    // router.replace(`/editor/${slugify(data.title)}?page=${page}`)
    router.refresh()

    return toast({
      description: 'Your post has been saved.'
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mx-auto grid w-[800px]  gap-10 '>
        <div className='flex  items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Link href={`/cpanel/${page}`} className={cn(buttonVariants({ variant: 'ghost' }))}>
              <>
                <Icons.chevronLeft className='mr-2 h-4 w-4' />
                Back
              </>
            </Link>
            {/* <p className='text-sm text-muted-foreground'>{post.published ? 'Published' : 'Draft'}</p> */}
            <Badge text={post.published ? 'Publish' : 'Draft'} variant={post.published ? 'black' : 'outline'} />
          </div>
          <div className='space-x-2'>
            <button
              onClick={() => (state.button = post.published ? 'unpublish' : 'publish')}
              type='submit'
              disabled={isSaving}
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              {isSaving && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              <span>{post.published ? 'Unpublish' : 'Publish'}</span>
            </button>

            <button type='submit' onClick={() => (state.button = 'save')} name='save' disabled={isSaving} className={cn(buttonVariants())}>
              {isSaving && state.button === 'save' && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              <span>Save</span>
            </button>
          </div>
        </div>
        <div className='mx-auto w-full rounded-lg border border-zinc-200 bg-zinc-50 p-12'>
          <div className='w-fit'>
            <div className='prose prose-stone dark:prose-invert'>
              <TextareaAutosize
                autoFocus
                id='title'
                defaultValue={post.title}
                placeholder='Post title'
                className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none'
                {...register('title')}
              />
              <TextareaAutosize
                autoFocus
                id='description'
                defaultValue={post.description || ''}
                placeholder='Description'
                className='mb-5 w-full resize-none appearance-none overflow-hidden bg-transparent text-lg font-medium focus:outline-none'
                {...register('description')}
              />
              <hr className='mb-3' />
              <div id='editor' className='min-h-[500px]' />
              <p className='text-sm text-gray-500'>
                Use <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>Tab</kbd> to open the command menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
