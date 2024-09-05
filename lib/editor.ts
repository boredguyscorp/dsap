import { JSONContent } from 'novel'
import { defaultExtensions } from '@/components/advance-text-editor/extensions'
import { generateHTML } from '@tiptap/core'

export const getGeneratedHTML = (content: JSONContent | null | undefined) => {
  if (!content || typeof window === 'undefined') return undefined
  return generateHTML(content, defaultExtensions)
}
