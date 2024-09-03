'use client'

import { utils, writeFile } from 'xlsx-js-style'
import { Button } from '@/components/ui/button'
import { useCallback, useState } from 'react'
import { MembershipStatus } from './membership'
import { Members } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MembershipForm from '@/app/(root)/(routes)/membership/_components/form'
import { ChapterList } from '@/actions/fetchers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { EyeOff } from 'lucide-react'
import { Eye } from 'lucide-react'
import { Icons } from '@/components/shared/icons'
import { styleWorkSheet, toDate } from '@/lib/utils'

type MemberType = Members & { memberChapter: { id: string; code: string; name: string } | null }

export function ActionButton({ members, chapters }: { members: MemberType[]; chapters: ChapterList }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const stat = searchParams?.get('showStat') === 'true'

  const handleExport = useCallback(() => {
    const data = members.map((member) => ({
      Code: member.code,
      'Drugstore Name': member.drugStoreName,
      Chapter: member.memberChapter ? member.memberChapter.name : '',
      Address: member.address,
      Email: member.emailAdd,
      'Mobile No': member.mobileNo,
      'Telephone No': member.telNo,
      'Ownership Type': member.ownershipType,
      'Membership Type': member.membershipType,
      'Drugstore Classification': member.drugstoreClass,
      'Proof of Payment URL': member.proofOfPaymentUrl
    }))

    const wb = utils.book_new()
    const ws = utils.json_to_sheet(data)

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Code
      { wch: 25 }, // Drugstore Name
      { wch: 20 }, // Chapter
      { wch: 35 }, // Address
      { wch: 30 }, // Email
      { wch: 15 }, // Mobile No
      { wch: 15 }, // Telephone No
      { wch: 20 }, // Ownership Type
      { wch: 20 }, // Membership Type
      { wch: 25 }, // Drugstore Classification
      { wch: 35 } // Proof of Payment URL
    ]

    // tyle worksheet
    styleWorkSheet({
      worksheet: ws,
      cellStyle: { alignment: { horizontal: 'center', vertical: 'center', wrapText: true } },
      headerStyle: { font: { bold: true } }
    })

    utils.book_append_sheet(wb, ws, 'DSAP Members')
    writeFile(wb, `dsap-members-${toDate(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }, [members])

  const [openDialog, setOpenDialog] = useState<{
    isOpen: boolean
    type: MembershipStatus | 'details' | 'edit' | 'create'
    row: Members | undefined
  } | null>(null)

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button onClick={() => setOpenDialog({ isOpen: true, type: 'create', row: undefined })}>Create Member</Button>

      <Button variant='outline' size='icon' onClick={handleExport}>
        <Icons.download className='h-5 w-5' />
      </Button>

      <Button
        variant='outline'
        size='icon'
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
