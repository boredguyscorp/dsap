'use client'

import * as React from 'react'
// import { tasks, type Task as Tasks } from '@/db/schema'
import { Tasks } from '@prisma/client'

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
  DropdownMenuItem,
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
import { TaskLabel, labelEnum, priorityEnum, statusEnum } from '@/app/(app.domain.com)/dashboard/membership/_components/tasks'
// import { deleteTask, updateTaskLabel } from '@/app/_actions/task'

const labels: {
  value: Tasks['label']
  label: string
}[] = [
  {
    value: 'bug',
    label: 'Bug'
  },
  {
    value: 'feature',
    label: 'Feature'
  },
  {
    value: 'documentation',
    label: 'Documentation'
  }
]

interface TasksTableShellProps {
  data: Tasks[]
  pageCount: number
}

export function TasksTableShell({ data, pageCount }: TasksTableShellProps) {
  const [isPending, startTransition] = React.useTransition()
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

  //   const handleSeed = async () => {
  //     startTransition(async () => {
  //       await seedTasksAction()
  //     })
  //   }

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Tasks, unknown>[]>(
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
        header: ({ column }) => <DataTableColumnHeader column={column} title='Task' />,
        cell: ({ row }) => <div className='w-[80px]'>{row.getValue('code')}</div>,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
        cell: ({ row }) => {
          const label = labelEnum.find((label) => label === row.original.label)

          return (
            <div className='flex space-x-2'>
              {label && <Badge variant='outline'>{label}</Badge>}
              <span className='max-w-[500px] truncate font-medium'>{row.getValue('title')}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
          const status = statusEnum.find((status) => status === row.original.status)

          if (!status) {
            return null
          }

          return (
            <div className='flex w-[100px] items-center'>
              {status === 'canceled' ? (
                <CrossCircledIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : status === 'done' ? (
                <CheckCircledIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : status === 'in-progress' ? (
                <StopwatchIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : status === 'todo' ? (
                <QuestionMarkCircledIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )}
              <span className='capitalize'>{status}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return value instanceof Array && value.includes(row.getValue(id))
        }
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
        cell: ({ row }) => {
          const priority = priorityEnum.find((priority) => priority === row.original.priority)

          if (!priority) {
            return null
          }

          return (
            <div className='flex items-center'>
              {priority === 'low' ? (
                <ArrowDownIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : priority === 'medium' ? (
                <ArrowRightIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : priority === 'high' ? (
                <ArrowUpIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              ) : (
                <CircleIcon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
              )}
              <span className='capitalize'>{priority}</span>
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
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) => {
                      startTransition(async () => {
                        await updateTaskLabelAction({
                          id: row.original.id,
                          label: value as TaskLabel
                        })
                      })
                    }}
                  >
                    {labels.map((label) => (
                      <DropdownMenuRadioItem key={label.value} value={label.value} disabled={isPending}>
                        {label.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false)

                    toast.promise(deleteTask(row.original.id), {
                      loading: 'Deleting...',
                      success: () => 'Task deleted successfully.',
                      error: (err: unknown) => catchError(err)
                    })
                  })
                }}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
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
        return 'Tasks deleted successfully.'
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
            options: statusEnum.map((status) => ({
              label: status[0]?.toUpperCase() + status.slice(1),
              value: status
            }))
          },
          {
            id: 'priority',
            title: 'Priority',
            options: priorityEnum.map((priority) => ({
              label: priority[0]?.toUpperCase() + priority.slice(1),
              value: priority
            }))
          }
        ]}
        // Render dynamic searchable filters
        searchableColumns={[
          {
            id: 'title',
            title: 'titles'
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
