import { getChapters } from '@/actions/fetchers'
import MembershipForm from './_components/form'

export default async function MembershipPage() {
  const chapters = await getChapters()

  return <MembershipForm chapters={chapters} />
}
