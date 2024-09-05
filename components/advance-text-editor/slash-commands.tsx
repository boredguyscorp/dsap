import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import { CheckSquare, Code, Heading1, Heading2, Heading3, ImageIcon, List, ListOrdered, Text, TextQuote } from 'lucide-react'
import { EditorInstance } from 'novel'

import { createSuggestionItems } from 'novel/extensions'
import { ReactNode, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import tippy from 'tippy.js'

export const suggestionItems = createSuggestionItems([
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
    }
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large', 'h1'],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    }
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium', 'h2'],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    }
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small', 'h3'],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    }
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    }
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point', 'list'],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered', 'list'],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote', 'quote'],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').toggleBlockquote().run()
  }
  // {
  //   title: 'Code',
  //   description: 'Capture a code snippet.',
  //   searchTerms: ['codeblock'],
  //   icon: <Code size={18} />,
  //   command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
  // }
  //? working image upload but temporary disabled
  // {
  //   title: 'Image',
  //   description: 'Upload an image from your computer',
  //   searchTerms: ['photo', 'image', 'img', 'picture', 'media'],
  //   icon: <ImageIcon size={18} />,
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).run()

  //     //upload image
  //     const input = document.createElement('input')
  //     input.type = 'file'
  //     input.accept = 'image/*'
  //     input.onchange = async () => {
  //       if (input.files?.length) {
  //         const file = input.files[0]
  //         const pos = editor.view.state.selection.from
  //         const upload = uploadFn(limit)

  //         upload(file, editor.view, pos)
  //       }
  //     }
  //     input.click()
  //   }
  // }
])

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: EditorInstance; range: Range; props: any }) => {
          props.command({ editor, range })
        }
      }
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ]
  }
})

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight
  const itemHeight = item ? item.offsetHeight : 0

  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
  }
}

interface CommandItemProps {
  title: string
  description: string
  icon: ReactNode
}

const CommandList = memo(({ items, command, editor, range }: { items: CommandItemProps[]; command: any; editor: any; range: any }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]

      if (item) command(item)
    },
    [command, editor, items]
  )

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter']
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault()
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length)
          return true
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length)
          return true
        }
        if (e.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
        return false
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [items, selectedIndex, setSelectedIndex, selectItem])

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const commandListContainer = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = commandListContainer?.current

    const item = container?.children[selectedIndex] as HTMLElement

    if (item && container) updateScrollView(container, item)
  }, [selectedIndex])

  return items.length > 0 ? (
    <div
      id='slash-command'
      ref={commandListContainer}
      className='z-50 h-auto max-h-[330px] w-72 overflow-y-auto scroll-smooth rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all dark:border-stone-700 dark:bg-black'
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            type='button'
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 dark:text-white dark:hover:bg-stone-800 ${
              index === selectedIndex ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white' : ''
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white dark:border-stone-700 dark:bg-black'>
              {item.icon}
            </div>
            <div>
              <p className='font-medium'>{item.title}</p>
              <p className='text-xs text-stone-500'>{item.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  ) : null
})

const renderItems = () => {
  let component: ReactRenderer | null = null
  let popup: any | null = null

  return {
    onStart: (props: { editor: EditorInstance; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor
      })

      // @ts-ignore
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      })
    },
    onUpdate: (props: { editor: EditorInstance; clientRect: DOMRect }) => {
      component?.updateProps(props)

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        })
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide()

        return true
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props)
    },
    onExit: () => {
      popup?.[0].destroy()
      component?.destroy()
    }
  }
}

export const slashCommand = Command.configure({
  suggestion: {
    items: ({ query }: { query: string }) =>
      suggestionItems.filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase()
          return (
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search) ||
            (item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
          )
        }
        return true
      }),
    render: renderItems
  }
})
