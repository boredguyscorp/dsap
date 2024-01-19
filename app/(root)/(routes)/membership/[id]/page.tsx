import { getChapters } from '@/actions/fetchers'
import MembershipForm from '../_components/form'
import { findMemberById } from '@/actions/members'
import { notFound } from 'next/navigation'

export default async function MembershipPageRecord({ params }: { params: { id: string } }) {
  const member = await findMemberById(params.id)
  const chapters = await getChapters()

  if (!member) notFound()

  return <MembershipForm chapters={chapters} memberDetails={member} />
}
