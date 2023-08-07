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
import { ApiKeyEntity, revokeApiKey, rollApiKey } from '@/actions/api-key'

const columnHelper = createColumnHelper<ApiKeyEntity>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        disabled={table.getRowModel().rows.length === 0 || table.getRowModel().rows.every((row) => row.original.revokedAt !== null)}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={row.original.revokedAt !== null}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select'
      />
    )
  }),
  columnHelper.accessor('key', {
    cell: function Key(t) {
      const [show, setShow] = useState(false)
      const [copied, setCopied] = useState(false)
      const toaster = useToast()

      const key = t.getValue()

      const displayText = show ? key : 'bg_key_****************'
      return (
        <div className='flex items-center justify-between'>
          <span className={cn('max-w-[200px] break-all font-mono', t.row.original.revokedAt !== null && 'line-through')}>
            {/* <p className='break-all'>{displayText}</p> */}
            {displayText}
          </span>
          <div className='invisible flex items-center gap-2 group-hover:visible'>
            <Button
              variant='ghost'
              className='h-4 w-4 p-0 opacity-50'
              disabled={show}
              onClick={() => {
                setShow(true)

                setTimeout(() => {
                  setShow(false)
                }, 2000)
              }}
            >
              <span className='sr-only'>Toggle key visibility</span>
              {show ? <EyeOff /> : <Eye />}
            </Button>
            <Button
              variant='ghost'
              className='h-4 w-4 p-0 opacity-50'
              onClick={async () => {
                toaster.toast({
                  title: 'Copied API Key to clipboard.'
                })

                setCopied(true)
                await Promise.all([navigator.clipboard.writeText(key), new Promise((resolve) => setTimeout(resolve, 2000))])
                setCopied(false)
              }}
            >
              <span className='sr-only'>Copy key</span>
              {copied ? <Icons.check /> : <Icons.copy />}
            </Button>
          </div>
        </div>
      )
    },
    header: 'Key'
  }),
  columnHelper.accessor('name', {
    cell: (t) => {
      const value = t.getValue()
      return value
    },
    header: 'Name'
  }),
  columnHelper.accessor('location.name', {
    cell: (t) => {
      const value = t.getValue()
      return value
    },
    header: 'Location'
  }),
  columnHelper.accessor('createdAt', {
    cell: (t) => toDateDistance(t.getValue()),
    header: 'Created At'
  }),
  columnHelper.accessor('expiresIn', {
    cell: (t) => t.getValue(),
    header: 'Expires In'
  }),
  columnHelper.accessor('expiresAt', {
    cell: (t) => {
      if (t.row.original.revokedAt !== null) {
        return (
          <div className='flex flex-col text-destructive'>
            <span>Revoked</span>
            <span>{toDateDistance(t.row.original.revokedAt)}</span>
          </div>
        )
      }

      const value = t.getValue()
      if (value === null) {
        return 'Never expires'
      }

      if (value < new Date()) {
        return (
          <div className='flex flex-col text-destructive'>
            <span>Expired</span>
            <span>{toDateNormal(value)}</span>
          </div>
        )
      }

      return toDateNormal(value)
    },
    header: 'Expires At'
  }),
  columnHelper.display({
    id: 'actions',
    cell: function Actions(t) {
      const apiKey = t.row.original
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
                    await revokeApiKey(apiKey.id)

                    t.row.toggleSelected(false)
                    router.refresh()
                    toaster.toast({ title: 'API Key revoked' })
                  })
                } catch {
                  toaster.toast({
                    title: 'Failed to revoke API Key',
                    variant: 'destructive'
                  })
                }
              }}
              className='text-destructive'
            >
              <Icons.trash className='mr-2 h-4 w-4' />
              <span>Revoke key</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                try {
                  setIsMutating(async () => {
                    await rollApiKey(apiKey.id)

                    router.refresh()
                    toaster.toast({ title: 'API Key rolled' })
                  })
                } catch {
                  toaster.toast({
                    title: 'Failed to roll API Key',
                    variant: 'destructive'
                  })
                }
              }}
              className='text-destructive'
            >
              <Icons.refresh className='mr-2 h-4 w-4' />
              <span>Roll key</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  })
]

type DataTableProps = { apiKeyData: ApiKeyEntity[]; isLoading?: boolean }

export function DataTable(props: DataTableProps) {
  const { apiKeyData, isLoading } = props

  const [rowSelection, setRowSelection] = useState({})
  const [showRevoked, setShowRevoked] = useState(true)

  const table = useReactTable({
    data: apiKeyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: (row) => {
      return row.original.revokedAt === null
    },
    state: {
      rowSelection
    }
  })

  const filteredRows = showRevoked ? table.getRowModel().rows : table.getRowModel()?.rows.filter((row) => row.original.revokedAt === null)

  return (
    <div>
      <div className='flex items-center gap-2 py-2'>
        <Label>Show revoked</Label>
        <Checkbox checked={showRevoked} onCheckedChange={(c) => setShowRevoked(!!c)} className='max-w-sm' />
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
                    if (row.original.revokedAt !== null) {
                      return true
                    }
                    if (row.original.expiresAt !== null) {
                      return row.original.expiresAt < new Date()
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
