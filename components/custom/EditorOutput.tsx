'use client'

import dynamic from 'next/dynamic'
import CustomImageRenderer from './renderers/CustomImageRenderer'
import CustomCodeRenderer from './renderers/CustomCodeRenderer'

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, { ssr: false })

interface EditorOutputProps {
  content: any
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem'
  }
}

function EditorOutput({ content }: EditorOutputProps) {
  return <Output style={style} className='text-sm' renderers={renderers} data={content} />
}

export default EditorOutput
