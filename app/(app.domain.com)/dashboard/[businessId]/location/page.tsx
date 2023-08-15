import { DashboardShell } from '@/app/(app.domain.com)/_components/dashboard-shell'
import { DataTable } from './data-table'
import { LocationForm } from './location-form'
import { getLocation } from '@/actions/location'

export default async function ApiKeysPage({ params }: { params: { businessId: string; organizationId: string } }) {
  const { organizationId, businessId } = params

  const locationData = await getLocation(organizationId, businessId)

  return (
    <DashboardShell title='Location List' description='Location for this business will show up here' headerAction={<LocationForm />}>
      <DataTable data={locationData} />
    </DashboardShell>
  )
}
