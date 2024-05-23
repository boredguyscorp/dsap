'use client'

import { useState } from 'react'
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorContent,
  EditorInstance,
  EditorRoot,
  JSONContent
} from 'novel'
import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import { handleCommandNavigation } from 'novel/extensions'
import { Fragment } from '@tiptap/pm/model'
import { EditorEvents } from '@tiptap/core'

import { useDebouncedCallback } from 'use-debounce'
import { defaultExtensions } from './extensions'
import { slashCommand, suggestionItems } from './slash-commands'
import { Separator } from '../ui/separator'
import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { TextButtons } from './selectors/text-buttons'
import { ColorSelector } from './selectors/color-selector'
import { uploadFn } from './image-upload'
import { toast } from 'sonner'
import { cn, extractFileKeyFromUrl } from '@/lib/utils'
import { onDelete } from '@/actions/editor'
import EditorInitializer from './editor-initializer'
import { ImageResizer } from './image-resizer'

type AdvanceEditorProps = {
  className?: string
  editorClassName?: string
  onChange: (content: string) => void
  value: string
  isError?: boolean
  errorMessage?: string
  errorClassName?: string
}

//TODO: if editor is allowed to upload image, add "limit props, limit should be pass to slashCommand on uploading files

//? this editor component uses novel rich text editor: https://www.npmjs.com/package/novel
export default function AdvanceEditor({
  className,
  editorClassName,
  value,
  onChange,
  isError,
  errorMessage,
  errorClassName
}: AdvanceEditorProps) {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null)

  const [openNode, setOpenNode] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openColor, setOpenColor] = useState(false)

  const extensions = [...defaultExtensions, slashCommand]

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const markDown = editor.storage.markdown.getMarkdown() as string
    onChange(markDown)
  }, 500)

  const onUpdate = ({ editor }: EditorEvents['update']) => {
    debouncedUpdates(editor)
  }
  const onTransaction = async ({ transaction }: EditorEvents['transaction']) => {
    const getImageSrcs = (fragment: Fragment) => {
      let srcs = new Set()
      fragment.forEach((node) => {
        if (node.type.name === 'image') {
          srcs.add(node.attrs.src)
        }
      })
      return srcs
    }

    let currentSrcs = getImageSrcs(transaction.doc.content)
    let previousSrcs = getImageSrcs(transaction.before.content)

    if (currentSrcs.size === 0 && previousSrcs.size === 0) {
      return
    }

    //? Determine which images were deleted
    let deletedImageSrcs = [...previousSrcs].filter((src) => !currentSrcs.has(src))

    if (deletedImageSrcs.length > 0) {
      try {
        const imgUrl = deletedImageSrcs[0] as string
        const deleted = await onDelete(extractFileKeyFromUrl(imgUrl))

        console.log(deleted)
      } catch (error) {
        console.error('ERROR_DELETING_UPLOADED_IMAGE_IN_EDITOR', error)
        toast.error('Failed to delete uploaded image')
      }
    }
  }

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent || undefined}
        extensions={extensions}
        className={cn(
          'prose-s relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg',
          className
        )}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event)
            // handlePaste: (view, event) => handleImagePaste(view, event, uploadFn(limit)),
            //@ts-ignore
            // handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn(limit))
          },
          attributes: {
            class: cn('prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full', editorClassName)
          }
        }}
        onTransaction={onTransaction}
        onUpdate={onUpdate}
        slotAfter={<ImageResizer />}
      >
        <EditorInitializer value={value} setInitialContent={setInitialContent} />

        <EditorCommand className='z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
          <EditorCommandEmpty className='px-2 text-muted-foreground'>No results</EditorCommandEmpty>
          {suggestionItems.map((item) => (
            <EditorCommandItem
              value={item.title}
              onCommand={(val) => item.command?.(val)}
              className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
              key={item.title}
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>{item.icon}</div>
              <div>
                <p className='font-medium'>{item.title}</p>
                <p className='text-xs text-muted-foreground'>{item.description}</p>
              </div>
            </EditorCommandItem>
          ))}
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: 'top'
          }}
          className='flex w-fit max-w-[90vw] divide-x overflow-hidden rounded border border-muted bg-background shadow-xl'
        >
          <div>
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          </div>
          <div>
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          </div>
          <div>
            <TextButtons />
          </div>

          {/* //? Color selector apply color which output html element with "style" prop and allowing to output html from editor breaks or causes error when using it with next-mdx-remote */}
          {/* <ColorSelector open={openColor} onOpenChange={setOpenColor} /> */}
        </EditorBubble>
      </EditorContent>
      {isError && errorMessage ? <p className={cn('text-sm font-medium text-destructive', errorClassName)}>{errorMessage}</p> : null}
    </EditorRoot>
  )
}
