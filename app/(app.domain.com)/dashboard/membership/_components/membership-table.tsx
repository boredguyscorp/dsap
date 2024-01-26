'use client'

import * as React from 'react'
import { Members } from '@prisma/client'

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon
} from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { catchError, toDate, toProperCase } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { deleteTask, updateTaskLabelAction } from '@/actions/tasks'
import { MembershipStatus, membershipStatusEnum, membershipType, ownershipType } from './membership'
import { MemberEntity, emailMembershipStatus, updateMembershipStatusAction, updateStatusAction } from '@/actions/members'
import { DropdownMenuDemo } from './a-test'
import { ClipboardEdit, Command, Delete, Edit, Eye, Receipt, Trash, User, UserPlus, Users } from 'lucide-react'
import { ChapterList } from '@/actions/fetchers'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MembershipForm from '@/app/(root)/(routes)/membership/_components/form'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Icons } from '@/components/shared/icons'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail } from 'lucide-react'

// import { deleteTask, updateTaskLabel } from '@/app/_actions/task'

// export const status = ['pending', 'approved', 'rejected'] as const
// export type Status = typeof status[number]

const status: {
  value: MembershipStatus
  label: string
}[] = [
  {
    value: 'pending',
    label: 'Pending'
  },
  {
    value: 'approved',
    label: 'Approved'
  },
  {
    value: 'rejected',
    label: 'Rejected'
  },
  {
    value: 'import',
    label: 'Import'
  },
  {
    value: 'updated',
    label: 'Updated'
  }
]

interface MembershipTableShellProps {
  data: Members[]
  pageCount: number
  chapters: ChapterList
}

export function MembershipTableShell({ data, pageCount, chapters }: MembershipTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])
  const [openDialog, setOpenDialog] = React.useState<{
    isOpen: boolean
    type: MembershipStatus | 'details' | 'edit'
    row: Members
  } | null>(null)

  const refMessage = React.useRef<HTMLTextAreaElement | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Members, unknown>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
              setSelectedRowIds((prev) => (prev.length === data.length ? [] : data.map((row) => row.id)))
            }}
            aria-label='Select all'
            className='translate-y-[2px]'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
              setSelectedRowIds((prev) => (value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)))
            }}
            aria-label='Select row'
            className='translate-y-[2px]'
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
        cell: ({ row }) => (
          <div
            className='flex w-[100px] cursor-pointer space-x-2 hover:underline'
            onClick={() => {
              setOpenDialog({ isOpen: true, type: 'details', row: row.original })
            }}
          >
            {row.getValue('code')}
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'owner',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Owner' />,
        cell: ({ row }) => (
          <div className='max-w-[240px] truncate'>{`${toProperCase(row.original.opFirstName)} ${toProperCase(
            row.original.opLastName
          )}`}</div>
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'drugStoreName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Drugstore' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.getValue('drugStoreName')}</span>
            </div>
          )
        },
        enableHiding: false
      },
      {
        accessorKey: 'chapter',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Chapter' />,
        cell: ({ row }) => {
          const chapter = chapters.find((c) => c.id === row.original.chapter)?.name

          if (!chapter) {
            return null
          }

          return <div>{chapter}</div>
        },
        enableHiding: false
      },
      {
        accessorKey: 'ownershipType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Ownership Type' />,
        cell: ({ row }) => {
          const ownership = ownershipType.find((ownershipType) => ownershipType.value === row.original.ownershipType)?.value

          if (!ownership) {
            return null
          }

          return (
            <div className='flex items-center'>
              {ownership === 'single proprietor' ? (
                <User className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : ownership === 'corporation' ? (
                <Users className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : ownership === 'partnership' ? (
                <UserPlus className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )}
              <span className='capitalize'>{ownership}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return value instanceof Array && value.includes(row.getValue(id))
        }
      },
      {
        accessorKey: 'membershipType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Membership Type' />,
        cell: ({ row }) => {
          return <div>{toProperCase(row.getValue('membershipType'))}</div>
        }
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
          const stat = status.find((stat) => stat.value === row.original.status)

          if (!stat) {
            return null
          }

          return (
            <div className='flex w-[100px] items-center'>
              {stat.value === 'rejected' ? (
                <Badge variant='destructive'>{stat.label}</Badge>
              ) : stat.value === 'approved' ? (
                <Badge variant='default'>{stat.label}</Badge>
              ) : stat.value === 'pending' ? (
                <Badge variant='outline'>{stat.label}</Badge>
              ) : stat.value === 'import' ? (
                <Badge variant='warning'>{stat.label}</Badge>
              ) : stat.value === 'updated' ? (
                <Badge variant='success'>{stat.label}</Badge>
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )}

              {/* {status === 'rejected' ? (
                <CrossCircledIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : status === 'approved' ? (
                <CheckCircledIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : status === 'pending' ? (
                <StopwatchIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )} */}
              {/* <span className='capitalize'>{status}</span> */}
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return value instanceof Array && value.includes(row.getValue(id))
        }
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
                <DotsHorizontalIcon className='h-4 w-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDialog({ isOpen: true, type: 'details', row: row.original })
                  }}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDialog({ isOpen: true, type: 'edit', row: row.original })}>
                  <Edit className='mr-2 h-4 w-4' />
                  <span>Edit Membership</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash className='mr-2 h-4 w-4' />
                  <span>Delete</span>
                </DropdownMenuItem>
                {row.original.proofOfPaymentUrl && (
                  <DropdownMenuItem>
                    <a href={row.original.proofOfPaymentUrl} target='_blank' rel='noopener noreferrer' className='flex items-center'>
                      <Receipt className='mr-2 h-4 w-4' />
                      <span>Proof of Payment</span>
                    </a>
                  </DropdownMenuItem>
                )}
                {row.original.status !== 'pending' && (
                  <DropdownMenuItem
                    onClick={() => {
                      startTransition(() => {
                        toast.promise(emailMembershipStatus(row.original), {
                          loading: `Sending email to ${row.original.emailAdd}.`,
                          success: () => 'Successfully send email.',
                          error: (err: unknown) => catchError(err)
                        })
                      })
                    }}
                  >
                    <Mail className='mr-2 h-4 w-4' />
                    <span>Email {row.original.status === 'approved' ? 'Confirmation' : 'Rejection'}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Command className='mr-2 h-4 w-4' />
                    <span>Status</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={row.original.status}
                        onValueChange={(value) => {
                          const type = value as MembershipStatus

                          if (row.getValue('status') === type) return

                          if (type === 'rejected') {
                            setOpenDialog({ isOpen: true, type: 'rejected', row: row.original })
                            return
                          }

                          setOpenDialog({ isOpen: true, type, row: row.original })
                        }}
                      >
                        {status
                          .filter((s) => s.value !== 'import' && s.value !== 'updated')
                          .map((row) => (
                            <DropdownMenuRadioItem key={row.value} value={row.value} disabled={isPending}>
                              {row.label}
                            </DropdownMenuRadioItem>
                          ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [data, isPending]
  )

  function deleteSelectedRows() {
    toast.promise(Promise.all(selectedRowIds.map((id) => deleteTask(id))), {
      loading: 'Deleting...',
      success: () => {
        setSelectedRowIds([])
        return 'Members deleted successfully.'
      },
      error: (err: unknown) => {
        setSelectedRowIds([])
        return catchError(err)
      }
    })
  }

  function MemberDetails() {
    if (!openDialog) return null

    return (
      <>
        <div className='grid grid-cols-12 gap-1 text-base'>
          <h1 className='col-span-12 border-b pb-1 font-medium'>General Information</h1>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>Ref. No:</h1>
            <h1 className='col-span-8'>{openDialog.row.code}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>Drugstore Name:</h1>
            <h1 className='col-span-8'>{openDialog.row.drugStoreName}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Ownership Type:</h1>
            <h1 className='col-span-8'>{openDialog.row.ownershipType}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Address:</h1>
            <h1 className='col-span-8'>{openDialog.row.address}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Email Address:</h1>
            <h1 className='col-span-8'>{openDialog.row.emailAdd}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Membership Type:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.membershipType)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Mobile No:</h1>
            <h1 className='col-span-8'>{openDialog.row.mobileNo}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>DrugStore Classification:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.drugstoreClass)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Telephone No:</h1>
            <h1 className='col-span-8'>{openDialog.row.telNo}</h1>
          </div>

          <h1 className='col-span-12 border-b pb-1 pt-1 font-medium'>Drugstore Profile</h1>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>Setup:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.dpSetup)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>Store Hours:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.dpStoreHours)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Location:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.dpLocation)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Inventory System:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.dpInvSystem)}</h1>
          </div>

          <h1 className='col-span-12 border-b pb-1 pt-1 font-medium'>Owner Profile</h1>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>First Name:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.opFirstName)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-4'>Email Address:</h1>
            <h1 className='col-span-8'>{openDialog.row.opEmail}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Middle Name:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.opMiddleName)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Mobile No:</h1>
            <h1 className='col-span-8'>{openDialog.row.opCellNo}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Last Name:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.opLastName)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Telephone No:</h1>
            <h1 className='col-span-8'>{openDialog.row.opTelNo}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Address:</h1>
            <h1 className='col-span-8'>{openDialog.row.opAddress}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Status:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.opStatus)}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Birthday:</h1>
            <h1 className='col-span-8'>{toDate(new Date(openDialog.row.opBirthday as any))}</h1>
          </div>

          <div className='col-span-6 grid grid-cols-12 gap-1'>
            <h1 className='col-span-4'>Gender:</h1>
            <h1 className='col-span-8'>{toProperCase(openDialog.row.opGender)}</h1>
          </div>

          <h1 className='col-span-12 border-b pb-1 pt-1 font-medium'>Registration Details</h1>

          <div className='col-span-4 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-5'>FDA LTO No:</h1>
            <h1 className='col-span-7'>{openDialog.row.fdaLtoNo}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-5'>Business Permit No:</h1>
            <h1 className='col-span-7'>{openDialog.row.bpNo}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1 pt-2'>
            <h1 className='col-span-5'>DTI/SEC Certificate No:</h1>
            <h1 className='col-span-7'>{openDialog.row.docNo}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Issued:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.fdaDateIssued as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Issued:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.bpDateIssued as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Issued:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.docDateIssued as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Expiry:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.fdaDateExpiry as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Expiry:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.bpDateExpiry as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Date Expiry:</h1>
            <h1 className='col-span-7'>{toDate(new Date(openDialog.row.docDateExpiry as any))}</h1>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Attachment:</h1>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={openDialog.row.fdaUrlAttachment ?? '#'}
              className='col-span-7 mt-auto block align-bottom text-sm text-blue-500 hover:underline dark:text-blue-400'
            >
              Click here to see attachment.
            </a>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Attachment:</h1>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={openDialog.row.bpUrlAttachment ?? '#'}
              className='col-span-7 mt-auto block align-bottom text-sm text-blue-500 hover:underline dark:text-blue-400'
            >
              Click here to see attachment.
            </a>
          </div>

          <div className='col-span-4 grid grid-cols-12 gap-1'>
            <h1 className='col-span-5'>Attachment:</h1>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={openDialog.row.docUrlAttachment ?? '#'}
              className='col-span-7 mt-auto block align-bottom text-sm text-blue-500 hover:underline dark:text-blue-400'
            >
              Click here to see attachment.
            </a>
          </div>

          {openDialog.row.proofOfPaymentUrl && (
            <a
              href={openDialog.row.proofOfPaymentUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='col-span-8 pt-2 text-sm text-blue-500 hover:underline dark:text-blue-400'
            >
              Click here to see proof of payment.
            </a>
          )}
        </div>
      </>
    )
  }

  function handleUpdateStatus(id: string, status: MembershipStatus, options?: { message: string }) {
    try {
      startTransition(async () => {
        await updateMembershipStatusAction({
          id,
          status,
          options
        })

        setOpenDialog(null)
      })
    } catch (error) {
      console.log('UPDATE STATUS', error)
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        // Render notion like filters
        advancedFilter={false}
        // Render dynamic faceted filters
        filterableColumns={[
          {
            id: 'chapter',
            title: 'Chapter',
            options: chapters.map((membership) => ({
              label: membership.name[0]?.toUpperCase() + membership.name.slice(1),
              value: membership.name
            }))
          },
          {
            id: 'status',
            title: 'Status',
            options: membershipStatusEnum.map((status) => ({
              label: status[0]?.toUpperCase() + status.slice(1),
              value: status
            }))
          },
          {
            id: 'ownershipType',
            title: 'Ownership',
            options: ownershipType.map((ownership) => ({
              label: ownership.label[0]?.toUpperCase() + ownership.label.slice(1),
              value: ownership.value
            }))
          },
          {
            id: 'membershipType',
            title: 'Membership',
            options: membershipType.map((membership) => ({
              label: membership.label[0]?.toUpperCase() + membership.label.slice(1),
              value: membership.value
            }))
          }
        ]}
        // Render dynamic searchable filters
        searchableColumns={[
          // !TODO when adding additiional element for searchable column other will not work
          {
            id: 'drugStoreName',
            title: 'Member'
          }
        ]}
        // Render floating filters at the bottom of the table on column selection
        floatingBar={true}
        // Delete rows action
        deleteRowsAction={deleteSelectedRows}
      />

      {openDialog && (openDialog.type === 'approved' || openDialog.type === 'pending') && (
        <AlertDialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <AlertDialogContent className='max-h-[95vh] sm:max-w-5xl'>
            <AlertDialogHeader>
              <AlertDialogTitle>{toProperCase(openDialog.type)} Membership Application?</AlertDialogTitle>
              <AlertDialogDescription>
                <h1 className='mb-3 text-base font-medium'>Member Details</h1>
                <MemberDetails />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button
                type='button'
                onClick={() => {
                  ;(openDialog.type === 'approved' || openDialog.type === 'pending') &&
                    handleUpdateStatus(openDialog.row.id, openDialog.type)
                }}
                disabled={isPending}
              >
                {isPending ? 'Processing' : 'Proceed'}
                {isPending && <Icons.spinner className='ml-2 h-4 w-4 animate-spin' />}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {openDialog && openDialog.type === 'rejected' && (
        <Dialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className='max-h-[95vh] overflow-auto sm:max-w-5xl'>
            <DialogHeader>
              <DialogTitle>Reject Membership Application</DialogTitle>
              <DialogDescription>Your message or the basis for the membership rejection..</DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <MemberDetails />
                <Label htmlFor='message' className='sr-only'>
                  Reason/Message
                </Label>
                <Textarea ref={refMessage} id='message' rows={4} className='mt-2' />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                onClick={() => {
                  handleUpdateStatus(openDialog.row.id, 'rejected', { message: refMessage.current?.value ?? '' })
                }}
                disabled={isPending}
              >
                {isPending ? 'Processing' : 'Proceed'}
                {isPending && <Icons.spinner className='ml-2 h-4 w-4 animate-spin' />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {openDialog && openDialog.type === 'details' && (
        <Dialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className='max-h-[95vh] sm:max-w-5xl'>
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <MemberDetails />
              </div>
            </div>
            <DialogFooter>
              <Button type='button' variant='secondary' onClick={() => setOpenDialog(null)} disabled={isPending}>
                Close
              </Button>
              <Button type='button' onClick={() => setOpenDialog({ isOpen: true, type: 'edit', row: openDialog.row })} disabled={isPending}>
                Edit Membership
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {openDialog && openDialog.type === 'edit' && (
        <Dialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className='max-h-[96vh] overflow-auto sm:max-w-6xl'>
            <DialogHeader>
              <DialogTitle>Edit Membership Details</DialogTitle>
            </DialogHeader>

            <MembershipForm
              className='!mx-0 !my-0 h-full min-h-[0] !p-0'
              showFormDefaultValue={true}
              chapters={chapters}
              memberDetails={openDialog.row as MemberEntity}
              showFormHeader={false}
              isModalForm={true}
              onClose={() => setOpenDialog(null)}
              strict={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
