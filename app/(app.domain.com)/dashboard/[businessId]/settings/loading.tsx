import { DashboardShell } from '@/app/(app.domain.com)/_components/dashboard-shell'
import { BusinessName } from './_components/business-name'
import { DeleteBusiness } from './_components/delete-business'

export default function Loading() {
  return (
    <DashboardShell title='Business' description='Manage your business' className='space-y-4'>
      <BusinessName currentName='' businessId='' />
      <DeleteBusiness />
    </DashboardShell>
  )
}
