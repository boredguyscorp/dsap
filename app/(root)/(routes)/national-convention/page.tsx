import { getChapters } from '@/actions/fetchers'
import { NationalConventionForm } from './_components/form'

export default async function NationalConventionPage() {
  const chapters = await getChapters()

  return <NationalConventionForm chapters={chapters} />
}
