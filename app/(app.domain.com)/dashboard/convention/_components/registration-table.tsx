'use client'

import * as React from 'react'
import { Registration } from '@prisma/client'

import { CircleIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { catchError, strProperCase, toDateTime } from '@/lib/utils'
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
import { ClipboardEdit, Command, Delete, Edit, Eye, FileText, Mail, PencilIcon, Receipt, Trash, User, UserPlus, Users } from 'lucide-react'
import { CURRENT_CONVENTION, conventions, rateValues } from './constant'
import { ConventionRegistrationForm, ConventionRegistrationFormSchema } from '@/lib/schema'
import { emailRegistrationStatus, updateRegistrationDetails, updateRegistrationStatusAction } from '@/actions/convention'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/shared/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RegistrationFormInputs } from '@/app/(root)/(routes)/national-convention/_components/form-content'
import { Form } from '@/components/ui/form'
import { useZodForm } from '@/lib/zod-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SubmitHandler } from 'react-hook-form'
import { ChapterList } from '@/actions/fetchers'

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
  chapters: ChapterList
  conventionCode: string
}

export function RegistrationTableShell({ data, pageCount, chapters, conventionCode }: RegistrationTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])
  const [openDialog, setOpenDialog] = React.useState<{
    isOpen: boolean
    type: MembershipStatus | 'details' | 'edit'
    row: Registration
  } | null>(null)

  const dsInfo = openDialog?.row.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']
  const addressInfo = openDialog?.row.address as ConventionRegistrationForm['address']

  const form = useZodForm({
    schema: ConventionRegistrationFormSchema,
    values: openDialog?.row
      ? {
          convention: CURRENT_CONVENTION,
          type: openDialog.row.type,
          firstName: openDialog.row.firstName,
          lastName: openDialog.row.lastName,
          emailAdd: openDialog.row.emailAdd,
          contactNo: openDialog.row.contactNo,
          proofOfPaymentUrl: openDialog.row.proofOfPaymentUrl,
          title: openDialog.row.title ?? '',
          middleName: openDialog.row.middleName ?? '',
          drugstoreInfo: dsInfo ?? {},
          address: addressInfo ?? {}
        }
      : {
          convention: CURRENT_CONVENTION,
          type: '26th-prm',
          firstName: '',
          lastName: '',
          emailAdd: '',
          contactNo: '',
          proofOfPaymentUrl: ''
        },
    shouldUnregister: false
  })

  const chapterList = React.useMemo(() => {
    return chapters.map(({ name }) => {
      return { label: name, value: name }
    })
  }, [])

  const regFeeList = React.useMemo(() => {
    return rateValues
      .filter((row) => row.convention === conventionCode)
      .map((row) => {
        return { label: row.label, value: row.value }
      })
  }, [])

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
        header: ({ column }) => <DataTableColumnHeader column={column} hidden title='Ref. No' />,
        cell: ({ row }) => {
          return (
            <div
              className='flex cursor-pointer space-x-2 hover:underline'
              onClick={() => {
                setOpenDialog({ isOpen: true, type: 'details', row: row.original })
              }}
            >
              <span className='max-w-[500px]  truncate font-medium'>{row.original.code}</span>
            </div>
          )
        },
        enableSorting: false
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
        accessorKey: 'emailAdd',
        header: ({ column }) => <DataTableColumnHeader column={column} hidden title='Email Add' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.original.emailAdd}</span>
            </div>
          )
        },
        hidden: true
      },
      {
        accessorKey: 'contactNo',
        header: ({ column }) => <DataTableColumnHeader column={column} hidden title='Contact No.' />,
        cell: ({ row }) => {
          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{row.original.contactNo}</span>
            </div>
          )
        },
        hidden: true
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
        },
        enableSorting: false
      },
      {
        accessorKey: 'drugstoreInfo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Chapter' />,
        cell: ({ row }) => {
          const dsInfo = row.original.drugstoreInfo as ConventionRegistrationForm['drugstoreInfo']

          return (
            <div className='flex space-x-2'>
              <span className='max-w-[500px] truncate font-medium'>{dsInfo?.chapter}</span>
            </div>
          )
        },
        enableSorting: false
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reg. Fee Type' />,
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
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Reg. Date' />,
        cell: ({ row }) => {
          const createdAt = toDateTime(row.original.createdAt)

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
          <DropdownMenu modal={false}>
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
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDialog({ isOpen: true, type: 'edit', row: row.original })
                  }}
                >
                  <PencilIcon className='mr-2 h-4 w-4' />
                  <span>Edit Registration</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* <Receipt className='mr-2 h-4 w-4' />
                  <span>Proof of Payment</span> */}
                  <a href={row.original.proofOfPaymentUrl} target='_blank' rel='noopener noreferrer' className='flex items-center'>
                    <Receipt className='mr-2 h-4 w-4' />
                    <span>Proof of Payment</span>
                  </a>
                </DropdownMenuItem>
                {row.original.status !== 'pending' && (
                  <DropdownMenuItem
                    onClick={() => {
                      startTransition(() => {
                        toast.promise(emailRegistrationStatus(row.original), {
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

          <h1 className='col-span-3'>Reg Date:</h1>
          <h1 className='col-span-9'>{toDateTime(openDialog.row.createdAt)}</h1>

          <div className='col-span-12 mt-2 flex items-center rounded-md bg-background/10 '>
            <a
              href={openDialog.row.proofOfPaymentUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-blue-500 hover:underline dark:text-blue-400'
            >
              Click here to see proof of payment.
            </a>
          </div>
        </div>
      </>
    )
  }

  const onSubmit: SubmitHandler<ConventionRegistrationForm> = async (data) => {
    if (!openDialog) return
    startTransition(async () => {
      try {
        // refUpload.current?.click()

        const response = await updateRegistrationDetails(data, openDialog.row.id)
        // console.log('🚀 -> startTransition -> response:', response)
        // await new Promise((res) => setTimeout(() => res('sending...'), 1000))
        // setResponse({ success: true, message: 'Successfully submitted your registration.' })
        toast.success('Successfully updated the registration', { position: 'top-center' })
        setOpenDialog(null)

        // setShowForm(false)

        // setTimeout(() => {
        //   // router.refresh()
        //   // setShowForm(false)
        //   window.location.reload()
        // }, 3000)
      } catch (error) {
        console.error('ERROR: ', error)
        // setResponse({ success: false, message: 'Error submitting registration! Please try again.' })
        toast.error('Error submitting registration! Please try again.', { position: 'top-center' })
      }
    })
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
          },
          {
            id: 'drugstoreInfo',
            title: 'Chapter',
            options: chapterList
          },
          {
            id: 'type',
            title: 'Reg. Fee',
            options: regFeeList
          }
        ]}
        // Render dynamic searchable filters
        searchableColumns={[
          {
            id: 'firstName',
            title: 'Registration'
          }
          // {
          //   id: 'lastName',
          //   title: 'Last Name'
          // }
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
              <Button type='button' variant='secondary' onClick={() => setOpenDialog(null)} disabled={isPending}>
                Close
              </Button>
              <Button type='button' onClick={() => setOpenDialog({ isOpen: true, type: 'edit', row: openDialog.row })} disabled={isPending}>
                Edit Registration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {openDialog && openDialog.type === 'edit' && (
        <Dialog open={openDialog?.isOpen} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className='sm:max-w-xl'>
            <DialogHeader>
              <DialogTitle>Edit Registration Details</DialogTitle>
              {/* <DialogDescription>Your message or the basis for the registration rejection..</DialogDescription> */}
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid flex-1 gap-2'>
                <Form {...form}>
                  <form className='max-h-[450px] space-y-4 overflow-y-scroll'>
                    <div className='p-2'>
                      <RegistrationFormInputs chapters={chapters} showAllFees />
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            <DialogFooter className='flex items-center sm:justify-between'>
              <span>
                <a
                  href={openDialog.row.proofOfPaymentUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-500 hover:underline dark:text-blue-400'
                >
                  Click here to see proof of payment.
                </a>
              </span>

              <div className='flex items-center gap-2'>
                <Button type='button' variant='secondary' onClick={() => setOpenDialog(null)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type='button' onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                  Update
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
