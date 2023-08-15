import { DataTable } from './data-table'
import { ApiKeyForm } from './api-key-form'
import { getApiKey } from '@/actions/api-key'
import { getLocation } from '@/actions/location'
import { DashboardShell } from '@/app/(app.domain.com)/_components/dashboard-shell'

export default async function ApiKeysPage({ params }: { params: { organizationId: string; businessId: string } }) {
  const { organizationId, businessId } = params

  const locationData = await getLocation(organizationId, businessId)
  const apiKeyData = await getApiKey(businessId)

  return (
    <DashboardShell title='API Key' description='Manage your API Key' headerAction={<ApiKeyForm locationData={locationData} />}>
      <DataTable apiKeyData={apiKeyData} />
    </DashboardShell>
  )
}
