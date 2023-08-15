'use client'

import { ComponentPropsWithoutRef, useMemo, useState } from 'react'
import { Check, ChevronsUpDown, PlusCircle, Store } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useOrganizationModal } from '@/hooks/use-organization-modal'
import { notFound, useParams, useRouter } from 'next/navigation'
import PlanBadge from '@/components/plan-badge'
import { Icons } from '@/components/shared/icons'

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface OrganizationSwitcherProps extends PopoverTriggerProps {
  organizationData: Record<string, any>[]
  userId: string
}

export function OrganizationSwitcher({ className, organizationData = [], userId }: OrganizationSwitcherProps) {
  const organizationModal = useOrganizationModal()
  const params = useParams()

  const router = useRouter()

  const activeOrganization = useMemo(() => {
    if (params?.organizationId === 'dashboard') {
      return organizationData.find((row) => row.isDefault == true)
    }

    return organizationData.find((item) => item.id === params?.organizationId)
  }, [params, organizationData])

  if (organizationData.length < 1) return null
  if (!activeOrganization) notFound()

  const [open, setOpen] = useState(false)

  const onOrganizationSelect = (organization: any) => {
    setOpen(false)
    router.push(`/${organization.id}`)
  }

  return (
    <div className='flex'>
      <Icons.divider className='h-8 w-8 text-gray-200' />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            role='combobox'
            aria-expanded={open}
            aria-label='Select a organization'
            className={cn('w-[180px] justify-between xs:w-[200px] sm:w-[280px]', className)}
          >
            <div className='flex items-center space-x-2'>
              <Store className='h-4 w-4' />
              <span className='inline-block max-w-[200px] truncate text-sm font-medium'>{activeOrganization?.name} </span>
            </div>

            <div className='flex items-center space-x-2'>
              {activeOrganization?.name && <PlanBadge plan='pro' className='hidden sm:block' />}
              <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[180px] p-0 xs:w-[200px] sm:w-[280px]'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search organization...' />
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup heading='Organization'>
                {organizationData.map((organization) => (
                  <CommandItem key={organization.id} onSelect={() => onOrganizationSelect(organization)} className='space-x-3 text-sm'>
                    <Store className='mr-2 h-4 w-4' />
                    <span
                      className={cn(
                        'inline-block max-w-[100px] truncate text-sm sm:max-w-[200px]',
                        activeOrganization?.id === organization.id ? 'font-medium' : 'font-normal'
                      )}
                    >
                      {organization.name}{' '}
                    </span>
                    <Check className={cn('ml-auto h-4 w-4', activeOrganization?.id === organization.id ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    organizationModal.onOpen()
                    organizationModal.setUserId(userId)
                  }}
                >
                  <PlusCircle className='mr-2 h-5 w-5' />
                  Create Organization
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
