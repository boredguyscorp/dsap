'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MembershipStatus } from './membership'
import { Members } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MembershipForm from '@/app/(root)/(routes)/membership/_components/form'
import { ChapterList } from '@/actions/fetchers'

export function ActionButton({ chapters }: { chapters: ChapterList }) {
  const [openDialog, setOpenDialog] = useState<{
    isOpen: boolean
    type: MembershipStatus | 'details' | 'edit' | 'create'
    row: Members | undefined
  } | null>(null)

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button onClick={() => setOpenDialog({ isOpen: true, type: 'create', row: undefined })}>Create Member</Button>

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
