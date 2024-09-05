'use client'

import { getGeneratedHTML } from '@/lib/editor'
import { cn } from '@/lib/utils'
import { JSONContent } from 'novel'
import { useMemo } from 'react'

type EditorHtmlContentProps = {
  className?: string
  value?: string | null
}

export default function EditorHtmlContent({ className, value }: EditorHtmlContentProps) {
  const html = useMemo(() => {
    if (!value) return null
    const content = JSON.parse(value) as JSONContent
    if (content) return getGeneratedHTML(content)
  }, [value])

  if (!html) return null

  return (
    <div
      className={cn('empty-p prose-headings:font-title font-default prose max-w-full dark:prose-invert focus:outline-none', className)}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  )
}
