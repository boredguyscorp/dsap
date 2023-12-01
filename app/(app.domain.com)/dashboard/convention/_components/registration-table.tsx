'use client'

import * as React from 'react'
import { Registration } from '@prisma/client'

import { CircleIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { catchError, strProperCase } from '@/lib/utils'
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { deleteTask, updateTaskLabelAction } from '@/actions/tasks'
import { MembershipStatus, membershipStatusEnum, ownershipType } from './membership'
import { ClipboardEdit, Command, Delete, Edit, Eye, FileText, Receipt, Trash, User, UserPlus, Users } from 'lucide-react'
import { conventions, rateValues } from './constant'
import { ConventionRegistrationForm } from '@/lib/schema'
import { updateRegistrationStatusAction } from '@/actions/convention'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/shared/icons'
import Link from 'next/link'

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
  }
]

interface RegistrationTableShellProps {
  data: Registration[]
  pageCount: number
}

export function RegistrationTableShell({ data, pageCount }: RegistrationTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])
  const [openDialog, setOpenDialog] = React.useState<{
    isOpen: boolean
    type: MembershipStatus | 'details'
    row: Registration
  } | null>(null)

  const refMessage = React.useRef<HTMLTextAreaElement | null>(null)

  // const [selectedRow, setSelectedRow] = React.useState<Registration | null>(null)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Registration, unknown>[]>(
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
        accessorKey: 'refNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Ref. No' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.original.code}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'firstName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.getValue('firstName')}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'lastName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.getValue('lastName')}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'establishment',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Drugstore/Establishment' />,
        cell: ({ row }) => {
          const dsInfo = row.original.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']

          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{dsInfo?.establishment}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'chapter',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Chapter' />,
        cell: ({ row }) => {
          const dsInfo = row.original.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']

          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{dsInfo?.chapter}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'regFee',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reg. Fee' />,
        cell: ({ row }) => {
          const fee = rateValues.find((c) => c.value === row.original.type)?.label

          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{fee}</span>
            </div>
          )
        }
      },

      {
        accessorKey: 'regDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reg. Date' />,
        cell: ({ row }) => {
          const createdAt = new Intl.DateTimeFormat('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }).format(row.original.createdAt)

          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{createdAt}</span>
            </div>
          )
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
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )}
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
                <DropdownMenuItem>
                  {/* <Receipt className='mr-2 h-4 w-4' />
                  <span>Proof of Payment</span> */}
                  <a href={row.original.proofOfPaymentUrl} target='_blank' rel='noopener noreferrer' className='flex items-center'>
                    <Receipt className='mr-2 h-4 w-4' />
                    <span>Proof of Payment</span>
                  </a>
                </DropdownMenuItem>
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
                        {status.map((row) => (
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

  function handleUpdateStatus(id: string, status: MembershipStatus, options?: { message: string }) {
    try {
      startTransition(async () => {
        await updateRegistrationStatusAction({
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

  function deleteSelectedRows() {
    toast.promise(Promise.all(selectedRowIds.map((id) => deleteTask(id))), {
      loading: 'Deleting...',
      success: () => {
        setSelectedRowIds([])
        return 'Registration deleted successfully.'
      },
      error: (err: unknown) => {
        setSelectedRowIds([])
        return catchError(err)
      }
    })
  }

  function RegDetails() {
    if (!openDialog) return null

    const dsInfo = openDialog.row.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']

    return (
      <>
        <div className='grid grid-cols-12 gap-1 text-base'>
          <h1 className='col-span-3'>Ref. No:</h1>
          <h1 className='col-span-9'>{openDialog.row.code}</h1>

          <h1 className='col-span-3'>First Name:</h1>
          <h1 className='col-span-9'>{openDialog.row.firstName}</h1>

          <h1 className='col-span-3'>Last Name:</h1>
          <h1 className='col-span-9'>{openDialog.row.lastName}</h1>

          <h1 className='col-span-3'>Contact:</h1>
          <h1 className='col-span-9'>{openDialog.row.contactNo}</h1>

          <h1 className='col-span-3'>Email:</h1>
          <h1 className='col-span-9'>{openDialog.row.emailAdd}</h1>

          {dsInfo && dsInfo.establishment && (
            <>
              <h1 className='col-span-3'>Drugstore:</h1>
              <h1 className='col-span-9'>{dsInfo.establishment}</h1>
            </>
          )}

          {dsInfo && dsInfo.chapter && (
            <>
              <h1 className='col-span-3'>Chapter:</h1>
              <h1 className='col-span-9'>{dsInfo.chapter}</h1>
            </>
          )}

          <h1 className='col-span-3'>Reg Fee:</h1>
          <h1 className='col-span-9'>{rateValues.find((c) => c.value === openDialog.row.type)?.label}</h1>

          <div className='col-span-12 mt-2 flex items-center rounded-md bg-background/10 '>
            <a
              href={openDialog.row.proofOfPaymentUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-indigo-500 hover:underline dark:text-indigo-400'
            >
              Click here to see proof of payment.
            </a>
          </div>
        </div>
      </>
    )
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
            id: 'status',
            title: 'Status',
            options: membershipStatusEnum.map((status) => ({
              label: status[0]?.toUpperCase() + status.slice(1),
              value: status
            }))
          }
        ]}
        // Render dynamic searchable filters
        searchableColumns={[
          {
            id: 'firstName',
            title: 'First Name'
          },
          {
            id: 'lastName',
            title: 'Last Name'
          }
        ]}
        // Render floating filters at the bottom of the table on column selection
        floatingBar={true}
        // Delete rows action
        deleteRowsAction={deleteSelectedRows}
      />

      {openDialog && (openDialog.type === 'approved' || openDialog.type === 'pending') && (
        <AlertDialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <AlertDialogContent className='max-w-[500px]'>
            <AlertDialogHeader>
              <AlertDialogTitle>{strProperCase(openDialog.type)} Registration?</AlertDialogTitle>
              <AlertDialogDescription>
                <h1 className='mb-3 text-base font-medium'>Registration Details</h1>
                <RegDetails />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button
                type='button'
                onClick={() => {
                  openDialog.type !== 'details' && handleUpdateStatus(openDialog.row.id, openDialog.type)
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
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Reject Registration</DialogTitle>
              <DialogDescription>Your message or the basis for the registration rejection..</DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <RegDetails />
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
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
              {/* <DialogDescription>Your message or the basis for the registration rejection..</DialogDescription> */}
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <RegDetails />
              </div>
            </div>
            <DialogFooter>
              <Button type='button' onClick={() => setOpenDialog(null)} disabled={isPending}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
