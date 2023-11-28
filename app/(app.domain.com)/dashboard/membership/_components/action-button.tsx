'use client'

import { seedTasksAction } from '@/actions/tasks'
import { Button } from '@/components/ui/button'
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

      <Button>Create Member</Button>
    </div>
  )
}
