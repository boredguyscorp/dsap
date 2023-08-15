import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardShell } from '../_components/dashboard-shell'
import { Button } from '@/components/ui/button'

export default function Loading() {
  return (
    <DashboardShell
      title='Business'
      description='Business for this organization will show up here'
      headerAction={<Button disabled>Create a new business</Button>}
    >
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <BusinessCardSkeleton />
        <BusinessCardSkeleton />
      </ul>
    </DashboardShell>
  )
}

function BusinessCardSkeleton() {
  return (
    <Card>
      <div className='h-32 animate-pulse bg-muted' />
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
