'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MembershipStatus } from './membership'
import { Members } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MembershipForm from '@/app/(root)/(routes)/membership/_components/form'
import { ChapterList } from '@/actions/fetchers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { EyeOff } from 'lucide-react'
import { Eye } from 'lucide-react'

export function ActionButton({ chapters }: { chapters: ChapterList }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const stat = searchParams?.get('showStat') === 'true'

  const [openDialog, setOpenDialog] = useState<{
    isOpen: boolean
    type: MembershipStatus | 'details' | 'edit' | 'create'
    row: Members | undefined
  } | null>(null)

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button onClick={() => setOpenDialog({ isOpen: true, type: 'create', row: undefined })}>Create Member</Button>

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

      {openDialog && openDialog.type === 'create' && (
        <Dialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className='max-h-[96vh] overflow-auto sm:max-w-6xl'>
            <DialogHeader>
              <DialogTitle>Edit Membership Details</DialogTitle>
            </DialogHeader>

            <MembershipForm
              className='!mx-0 !my-0 h-full min-h-[0] !p-0'
              showFormDefaultValue={true}
              chapters={chapters}
              showFormHeader={false}
              isModalForm={true}
              onClose={() => setOpenDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
