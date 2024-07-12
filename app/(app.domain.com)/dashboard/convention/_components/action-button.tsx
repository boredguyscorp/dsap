'use client'

import { Icons } from '@/components/shared/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import { ConventionRegistrationForm } from '@/lib/schema'
import { cn, styleWorkSheet, toDate, toDateTime } from '@/lib/utils'
import { Registration } from '@prisma/client'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { utils, writeFile } from 'xlsx-js-style'
import { rateValues } from './constant'

export function ActionButton({ registrations }: { registrations: Registration[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCreateQueryString()

  const stat = searchParams?.get('showStat') === 'true'

  const handleExport = React.useCallback(() => {
    const data = registrations.map((registration) => {
      const dsInfo = registration.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']
      const fee = rateValues.find((c) => c.value === registration.type)?.label

      return {
        'Ref No': registration.code,
        'First Name': registration.firstName,
        'Last Name': registration.lastName,
        'Drugstore/Establishment': dsInfo?.establishment,
        Chapter: dsInfo?.chapter,
        'Registration Fee Type': fee,
        'Registration Date': toDateTime(registration.createdAt),
        Status: registration.status,
        Email: registration.emailAdd,
        'Contact No': registration.contactNo,
        'Proof of Payment URL': registration.proofOfPaymentUrl
      }
    })

    const wb = utils.book_new()
    const ws = utils.json_to_sheet(data)

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Ref No,
      { wch: 20 }, // First Name,
      { wch: 20 }, // Last Name,
      { wch: 25 }, // Drugstore/Establishment,
      { wch: 20 }, // Chapter,
      { wch: 25 }, // Registration Fee Type,
      { wch: 25 }, // Registration Date,
      { wch: 15 }, // Status,
      { wch: 30 }, // Email,
      { wch: 15 }, // Contact No
      { wch: 35 } // Proof of Payment URL
    ]

    // tyle worksheet
    styleWorkSheet({
      worksheet: ws,
      cellStyle: { alignment: { horizontal: 'center', vertical: 'center', wrapText: true } },
      headerStyle: { font: { bold: true } }
    })

    utils.book_append_sheet(wb, ws, 'DSAP Members')
    writeFile(wb, `dsap-convention-registrations-${toDate(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }, [registrations])

  return (
    <div className='flex items-center justify-center gap-2'>
      <Link href='/convention' className={cn(buttonVariants({ variant: 'outline' }))}>
        <>
          <Icons.chevronLeft className='mr-2 h-4 w-4' />
          Convention
        </>
      </Link>

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
    </div>
  )
}
