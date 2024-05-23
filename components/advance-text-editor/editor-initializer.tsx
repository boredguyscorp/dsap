'use client'

import { JSONContent, useEditor } from 'novel'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { defaultEditorContent } from './default-editor-content'

type EditorInitializerProps = { value: string; setInitialContent: Dispatch<SetStateAction<JSONContent | null>> }

export default function EditorInitializer({ value, setInitialContent }: EditorInitializerProps) {
  const { editor } = useEditor()

  useEffect(() => {
    if (editor && value) editor.commands.setContent(value)
    else setInitialContent(defaultEditorContent)

    return () => {
      editor?.destroy()
      setInitialContent(null)
    }
  }, [])

  return null
}
