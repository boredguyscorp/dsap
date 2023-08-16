import { uploadFiles } from '@/lib/uploadthing'
import { EditorView } from '@tiptap/pm/view'
// import { toast } from '../ui/use-toast'
// import { BlobResult } from "@vercel/blob";
// import { toast } from "../ui/use-toast";
import { toast } from 'react-hot-toast'

export const handleImageUpload = (file: File, view: EditorView, event: ClipboardEvent | DragEvent | Event) => {
  // check if the file is an image
  if (!file.type.includes('image/')) {
    toast.error('File type not supported.')

    // check if the file size is less than 50MB
  } else if (file.size / 1024 / 1024 > 50) {
    toast.error('File size too big (max 50MB).')
  } else {
    // upload to UploadThing.com
    toast.promise(
      uploadFiles({ endpoint: 'imageUploader', files: [file] }).then(async (res) => {
        // Successfully uploaded image
        if (res) {
          console.log('🚀 -> uploadFiles -> res:', res)
          // oscar comment

          const url = res[0].url

          // preload the image
          let image = new Image()
          image.src = url
          image.onload = () => {
            insertImage(url)
          }
        } else {
          throw new Error(`Error uploading image. Please try again.`)
        }
      }),
      {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully.',
        error: (e) => e.message
      },
      { position: 'bottom-center' }
    )
  }

  const insertImage = (url: string) => {
    // for paste events
    if (event instanceof ClipboardEvent) {
      return view.dispatch(
        view.state.tr.replaceSelectionWith(
          view.state.schema.nodes.image.create({
            src: url,
            alt: file.name,
            title: file.name
          })
        )
      )

      // for drag and drop events
    } else if (event instanceof DragEvent) {
      const { schema } = view.state
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY
      })
      const node = schema.nodes.image.create({
        src: url,
        alt: file.name,
        title: file.name
      }) // creates the image element
      const transaction = view.state.tr.insert(coordinates?.pos || 0, node) // places it in the correct position
      return view.dispatch(transaction)

      // for input upload events
    } else if (event instanceof Event) {
      return view.dispatch(
        view.state.tr.replaceSelectionWith(
          view.state.schema.nodes.image.create({
            src: url,
            alt: file.name,
            title: file.name
          })
        )
      )
    }
  }
}
