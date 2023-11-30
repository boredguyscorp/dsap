'use client'

import { seedTasksAction } from '@/actions/tasks'
import { Icons } from '@/components/shared/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

export function ActionButton() {
  const [isPending, startTransition] = React.useTransition()

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
      {/* <Button variant='outline' onClick={}>
        <ArrowLeft className='w-6 h-6'/>
      </Button> */}

      <Link href='/convention' className={cn(buttonVariants({ variant: 'outline' }))}>
        <>
          <Icons.chevronLeft className='mr-2 h-4 w-4' />
          Convention
        </>
      </Link>
    </div>
  )
}
