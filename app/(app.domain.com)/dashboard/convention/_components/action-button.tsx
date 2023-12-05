'use client'

import { seedTasksAction } from '@/actions/tasks'
import { Icons } from '@/components/shared/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { cn } from '@/lib/utils'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

export function ActionButton() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const stat = searchParams?.get('showStat') === 'true'

  return (
    <div className='flex items-center justify-center gap-2'>
      {/* <Button
        onClick={() => {
          startTransition(async () => {
            await seedTasksAction()
          })
        }}
        disabled={isPending}
        variant='outline'
      >
        {isPending ? 'Seeding...' : 'Seed Data'}
      </Button> */}

      {/* <Button>Create Convention</Button> */}
      {/* <Button variant='outline' >
        <ArrowLeft className='w-6 h-6'/>
      </Button> */}

      <Link href='/convention' className={cn(buttonVariants({ variant: 'outline' }))}>
        <>
          <Icons.chevronLeft className='mr-2 h-4 w-4' />
          Convention
        </>
      </Link>

      <Button
        variant='outline'
        title={`${stat ? 'Hide' : 'Show'} Registration Stats`}
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString({
              showStat: !stat
            })}`
          )
        }}
      >
        {stat ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
      </Button>
    </div>
  )
}
