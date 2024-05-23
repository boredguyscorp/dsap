import { cn } from '@/lib/utils'
import { EditorBubbleItem, useEditor } from 'novel'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon } from 'lucide-react'
import type { SelectorItem } from './node-selector'
import { Button } from '@/components/ui/button'

export const TextButtons = () => {
  const { editor } = useEditor()
  if (!editor) return null

  const items: SelectorItem[] = [
    {
      name: 'bold',
      command: (editor) => editor?.chain().focus().toggleBold().run(),
      isActive: (editor) => (editor ? editor.isActive('bold') : false),
      icon: BoldIcon
    },
    {
      name: 'italic',
      command: (editor) => editor?.chain().focus().toggleItalic().run(),
      isActive: (editor) => (editor ? editor.isActive('italic') : false),
      icon: ItalicIcon
    },
    {
      name: 'underline',
      command: (editor) => editor?.chain().focus().toggleUnderline().run(),
      isActive: (editor) => (editor ? editor.isActive('underline') : false),
      icon: UnderlineIcon
    },
    {
      name: 'strike',
      command: (editor) => editor?.chain().focus().toggleStrike().run(),
      isActive: (editor) => (editor ? editor.isActive('strike') : false),
      icon: StrikethroughIcon
    },
    {
      name: 'code',
      command: (editor) => editor?.chain().focus().toggleCode().run(),
      isActive: (editor) => (editor ? editor.isActive('code') : false),
      icon: CodeIcon
    }
  ]

  return (
    <div className='flex'>
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
          }}
        >
          <Button type='button' size='sm' className='rounded-none' variant='ghost'>
            <item.icon
              className={cn('h-4 w-4', {
                'text-blue-500': item.isActive(editor)
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  )
}
