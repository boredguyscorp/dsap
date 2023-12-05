'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type RegistrationStatCardProps =
  | {
      total: number
      approved: number
      pending: number
      rejected: number
      skeleton: false
    }
  | { skeleton: true }

export async function RegistrationStatCard(props: RegistrationStatCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  return (
    <div className='relative grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card
        className='group cursor-pointer'
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              status: null
            })}`
          )
        }}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium group-hover:underline'>Total Registration</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          {props.skeleton ? <Skeleton className='h-8 w-24' /> : <div className='text-2xl font-bold'>{props.total}</div>}
        </CardContent>
      </Card>
      <Card
        className='group cursor-pointer'
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              status: 'approved'
            })}`
          )
        }}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium group-hover:underline'>Approved</CardTitle>
          <CheckCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          {props.skeleton ? <Skeleton className='h-8 w-24' /> : <div className='text-2xl font-bold'>{props.approved}</div>}
        </CardContent>
      </Card>
      <Card
        className='group cursor-pointer'
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              status: 'pending'
            })}`
          )
        }}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium group-hover:underline'>Pending</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          {props.skeleton ? <Skeleton className='h-8 w-24' /> : <div className='text-2xl font-bold'>{props.pending}</div>}
        </CardContent>
      </Card>
      <Card
        className='group cursor-pointer'
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              status: 'rejected'
            })}`
          )
        }}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium group-hover:underline'>Rejected</CardTitle>
          <XCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          {props.skeleton ? <Skeleton className='h-8 w-24' /> : <div className='text-2xl font-bold'>{props.rejected}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
