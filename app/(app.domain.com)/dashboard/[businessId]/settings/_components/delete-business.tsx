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
import { deleteBusiness } from '@/actions/business'

export function DeleteBusiness() {
  const params = useParams() as { organizationId: string; businessId: string }

  const { organizationId, businessId } = params

  const toaster = useToast()
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useTransition()

  const title = 'Delete business'
  const description =
    'This will permanently delete your business and associated data. This action cannot be undone - please proceed with caution.'

  function handleDelete() {
    try {
      if (!businessId) throw new Error('No business ID')

      setIsDeleting(async () => {
        await deleteBusiness({ organizationId, businessId })

        toaster.toast({ title: 'Business deleted.' })
        router.push(`/${organizationId}`)
      })
    } catch {
      toaster.toast({
        title: 'Business could not be deleted',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card className='border-red-600'>
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

                {`I'm sure. Delete this business`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
