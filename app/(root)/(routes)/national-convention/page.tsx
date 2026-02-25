import { getChapters } from '@/actions/fetchers'
import { NationalConventionForm } from './_components/form'

export default async function NationalConventionPage() {
  const showRegistration = process.env.NEXT_PUBLIC_SHOW_REGISTRATION === 'true'

  const chapters = await getChapters()



  return showRegistration ? (
    <NationalConventionForm chapters={chapters} />
  ) : (
    <div className='flex min-h-[calc(100vh-340px)] items-center justify-center'>
      <p className='text-2xl font-bold text-red-500'>Registration Closed</p>
    </div>
  )
}
