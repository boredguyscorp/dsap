import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardShell } from '../../_components/dashboard-shell'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='p-4'>
      <div className='space-y-3'>
        <Skeleton className='h-10 w-4/5' />
        <Skeleton className='h-6 w-4/5' />
      </div>
    </div>
  )
}
