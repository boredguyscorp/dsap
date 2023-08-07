'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Eye, EyeOff } from 'lucide-react'

// import type { RouterOutputs } from '@acme/api'

import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

import { cn, toDateDistance, toDateNormal } from '@/lib/utils'
import { Icons } from '@/components/shared/icons'
import { LocationEntity, deleteLocation, updateLocation } from '@/actions/location'

const columnHelper = createColumnHelper<LocationEntity>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        disabled={table.getRowModel().rows.length === 0 || table.getRowModel().rows.every((row) => row.original.deletedAt !== null)}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={row.original.deletedAt !== null}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select'
      />
    )
  }),
  columnHelper.accessor('code', {
    cell: (t) => {
      const value = t.getValue()
      return value
    },
    header: 'Code'
  }),
  columnHelper.accessor('name', {
    cell: (t) => {
      const value = t.getValue()
      return value
    },
    header: 'Name'
  }),
  columnHelper.accessor('createdAt', {
    cell: (t) => toDateDistance(t.getValue()),
    header: 'Created At'
  }),
  columnHelper.accessor('updatedAt', {
    cell: (t) => {
      if (t.row.original.deletedAt !== null) {
        return (
          <div className='flex flex-col text-destructive'>
            <span>Deleted</span>
            <span>{toDateDistance(t.row.original.deletedAt)}</span>
          </div>
        )
      }

      return toDateDistance(t.getValue())
    },
    header: 'Updated At'
  }),
  columnHelper.display({
    id: 'actions',
    cell: function Actions(t) {
      const location = t.row.original
      const router = useRouter()
      const toaster = useToast()
      const [isMutating, setIsMutating] = useTransition()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>

              {isMutating ? <Icons.spinner className='h-4 w-4 animate-spin' /> : <Icons.ellipsis className='h-4 w-4' />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  setIsMutating(async () => {
                    await updateLocation(location.id)

                    router.refresh()
                    toaster.toast({ title: 'Location updated' })
                  })
                } catch {
                  toaster.toast({
                    title: 'Failed to update Location',
                    variant: 'destructive'
                  })
                }
              }}
            >
              <Icons.edit className='mr-2 h-4 w-4' />
              <span>Update</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                try {
                  setIsMutating(async () => {
                    await deleteLocation(location.id)

                    t.row.toggleSelected(false)
                    router.refresh()
                    toaster.toast({ title: 'Location deleted' })
                  })
                } catch {
                  toaster.toast({
                    title: 'Failed to delete Location',
                    variant: 'destructive'
                  })
                }
              }}
            >
              <Icons.trash className='mr-2 h-4 w-4' />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  })
]

export function DataTable(props: { data: LocationEntity[]; isLoading?: boolean }) {
  const { data, isLoading } = props

  const [rowSelection, setRowSelection] = useState({})
  const [showDeleted, setShowDeleted] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) => {
      return row.original.deletedAt === null
    },
    state: {
      rowSelection
    }
  })

  const filteredRows = showDeleted ? table.getRowModel().rows : table.getRowModel()?.rows.filter((row) => row.original.deletedAt === null)

  return (
    <div>
      <div className='flex items-center gap-2 py-2'>
        <Label>Show deleted</Label>
        <Checkbox checked={showDeleted} onCheckedChange={(c) => setShowDeleted(!!c)} className='max-w-sm' />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  disabled={(() => {
                    if (row.original.deletedAt !== null) {
                      return true
                    }

                    return false
                  })()}
                  className={cn('group')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {isLoading ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
