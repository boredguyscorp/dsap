import { DataTableLoading } from '@/components/data-table/data-table-loading'
import { Shell } from './_components/shell'
import { DashboardShell } from '../../_components/dashboard-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Loading() {
  return (
    <DashboardShell title='Convention & Registration' description='DSAP National Convention & Event' className='mt-10'>
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <CardSkeleton />
        <CardSkeleton />
      </ul>
    </DashboardShell>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <div className='h-64 animate-pulse bg-muted' />
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span className='mr-2 flex-1 animate-pulse rounded-sm bg-muted'>&nbsp;</span>

          <span className='w-12 animate-pulse rounded-sm bg-muted'>&nbsp;</span>
        </CardTitle>
        <CardDescription className='animate-pulse bg-muted'>&nbsp;</CardDescription>
      </CardHeader>
    </Card>
  )
}
