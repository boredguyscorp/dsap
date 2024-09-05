import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  InputRule
} from 'novel/extensions'
import { UploadImagesPlugin } from 'novel/plugins'
import { Markdown } from 'tiptap-markdown'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'
import AutoJoiner from 'tiptap-extension-auto-joiner'

import { cx } from 'class-variance-authority'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TiptapUnderline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return `Heading ${node.attrs.level}`
    }
    return "Press '/' for commands"
  },
  includeChildren: true
})

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx('text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer')
  }
})

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin({ imageClass: 'opacity-40 rounded-lg border border-stone-200' })]
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted')
  }
})

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted')
  }
})

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose pl-2')
  }
})
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex items-start my-4')
  },
  nested: true
})

const markdown = Markdown.configure({
  html: true,
  linkify: true,
  transformCopiedText: true,
  transformPastedText: true
})

const highlight = Highlight.configure({
  multicolor: true
})

const textStyle = TextStyle
const color = Color
const tiptapUnderline = TiptapUnderline
const textAlign = TextAlign.configure({
  types: ['heading', 'paragraph']
})

const horizontalRule = HorizontalRule.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        handler: ({ state, range }) => {
          const attributes = {}

          const { tr } = state
          const start = range.from
          let end = range.to

          tr.insert(start - 1, this.type.create(attributes)).delete(tr.mapping.map(start), tr.mapping.map(end))
        }
      })
    ]
  }
}).configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground')
  }
})

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx('list-disc list-outside leading-3 -mt-2')
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside leading-3 -mt-2')
    }
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal -mb-2')
    }
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-stone-700')
    }
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx('rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800')
    }
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted  px-1.5 py-1 font-mono font-medium before:content-none after:content-none'),
      spellcheck: 'false'
    }
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4
  },
  gapcursor: false
})

export const defaultExtensions = [
  // GlobalDragHandle,
  // AutoJoiner, // optional
  starterKit,
  placeholder,
  tiptapLink,
  tiptapUnderline,
  tiptapImage,
  textAlign,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  markdown,
  highlight,
  textStyle,
  color
]
