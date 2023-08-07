import { DashboardShell } from '@/app/(dashboard)/_components/dashboard-shell'
import { DataTable } from './data-table'

export default function Loading() {
  return (
    <DashboardShell title='Location List' description='Location for this business will show up here'>
      <DataTable data={[]} isLoading />
    </DashboardShell>
  )
}
