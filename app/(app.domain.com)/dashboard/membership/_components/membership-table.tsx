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

import { catchError } from '@/lib/utils'
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
import { MembershipStatus, membershipStatusEnum, ownershipType } from './membership'
import { updateStatusAction } from '@/actions/members'
import { DropdownMenuDemo } from './a-test'
import { ClipboardEdit, Command, Delete, Edit, Trash, User, UserPlus, Users } from 'lucide-react'

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

interface MembershipTableShellProps {
  data: Members[]
  pageCount: number
}

export function MembershipTableShell({ data, pageCount }: MembershipTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

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
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('code')}</div>,
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
        accessorKey: 'ownershipType',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Ownership Type' />,
        cell: ({ row }) => {
          const ownership = ownershipType.find((ownershipType) => ownershipType.value === row.original.ownershipType)?.value

          if (!ownership) {
            return null
          }

          return (
            <div className='flex items-center'>
              {ownership === 'single' ? (
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
                <DropdownMenuItem>
                  <Edit className='mr-2 h-4 w-4' />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash className='mr-2 h-4 w-4' />
                  <span>Delete</span>
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
                          startTransition(async () => {
                            await updateStatusAction({
                              id: row.original.id,
                              status: value as MembershipStatus
                            })
                          })
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
            id: 'ownershipType',
            title: 'Ownership',
            options: ownershipType.map((priority) => ({
              label: priority.label[0]?.toUpperCase() + priority.label.slice(1),
              value: priority.value
            }))
          }
        ]}
        // Render dynamic searchable filters
        searchableColumns={[
          {
            id: 'code',
            title: 'Code'
          },
          {
            id: 'drugStoreName',
            title: 'Drugstore'
          }
        ]}
        // Render floating filters at the bottom of the table on column selection
        floatingBar={true}
        // Delete rows action
        deleteRowsAction={deleteSelectedRows}
      />
    </>
  )
}
