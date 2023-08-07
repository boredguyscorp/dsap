import { DashboardShell } from '@/app/(dashboard)/_components/dashboard-shell'
import { DataTable } from './data-table'

export default function Loading() {
  return (
    <DashboardShell title='API Key' description='Manage your API Key'>
      <DataTable apiKeyData={[]} isLoading />
    </DashboardShell>
  )
}
