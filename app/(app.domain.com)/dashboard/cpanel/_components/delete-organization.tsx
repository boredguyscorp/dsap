'use client'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/shared/icons'
import { useTransition } from 'react'
import { deleteOrganization } from '@/actions/business'
import { cn } from '@/lib/utils'

export function DeleteOrganization({ isSuspense = true }: { isSuspense: boolean }) {
  const { organizationId } = useParams() as { organizationId: string }
  const toaster = useToast()
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useTransition()

  const title = 'Delete organization'
  const description =
    'This will permanently delete your Portal account and all associated data. This action cannot be undone - please proceed with caution.'

  function handleDelete() {
    try {
      if (!organizationId) throw new Error('No organization ID')

      setIsDeleting(async () => {
        await deleteOrganization(organizationId)

        toaster.toast({ title: 'Organization deleted.' })
        window.location.assign(`/dashboard`)
      })
    } catch {
      toaster.toast({
        title: 'Organization could not be deleted',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card className={cn('', !isSuspense && 'border-red-500')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='flex items-center'>{description}</CardDescription>
      </CardHeader>
      <CardFooter className='flex items-end justify-end'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='destructive'>{title}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className='flex items-center font-bold text-destructive'>
              <Icons.warning className='mr-2 h-6 w-6' />
              <p>This action can not be reverted</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary' disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}

                {`I'm sure. Delete this organization`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
