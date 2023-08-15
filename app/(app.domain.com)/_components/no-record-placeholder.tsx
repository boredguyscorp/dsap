import BlurImage from '@/components/shared/blur-image'

type NoLinksPlaceholderProps = {
  title: string
  description?: string
  ActionLinkButton?: () => JSX.Element
}

export default function NoRecordPlaceholder({ title, description, ActionLinkButton }: NoLinksPlaceholderProps) {
  return (
    <div className='flex flex-col items-center justify-center rounded-md border  bg-background py-10'>
      <h2 className='z-10 text-xl font-semibold text-gray-700'>{title}</h2>
      <BlurImage src='/_static/illustrations/video-park.svg' alt='No links yet' width={400} height={400} className='pointer-events-none -my-8' />
      {ActionLinkButton && <ActionLinkButton />}
      <p className='mt-2 text-sm text-gray-500'>{description}</p>
    </div>
  )
}
