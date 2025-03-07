import { BusinessName } from './_components/business-name'
import { findBusinessById } from '@/actions/business'
import { DeleteBusiness } from './_components/delete-business'
import { DashboardShell } from '@/app/(app.domain.com)/_components/dashboard-shell'

export default async function BusinessSettingsPage(props: { params: { organizationId: string; businessId: string } }) {
  const { businessId } = props.params
  const businessData = await findBusinessById(businessId)

  return (
    <DashboardShell title='Business' description='Manage your business' className='space-y-4'>
      <div className='flex flex-col gap-5'>
        <BusinessName currentName={businessData.name} businessId={businessId} />
        <DeleteBusiness />
      </div>
    </DashboardShell>
  )
}
