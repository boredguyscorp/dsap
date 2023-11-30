import { DataTableLoading } from '@/components/data-table/data-table-loading'
import { Shell } from '../_components/shell'
import { DashboardShell } from '../../../_components/dashboard-shell'

export default function ConventionRegistrationLoading() {
  return (
    <DashboardShell title='skeleton' description='' className='mb-0'>
      <div className='pb-8 pt-6 md:py-8'>
        <DataTableLoading columnCount={4} />
      </div>
    </DashboardShell>
  )
}
