'use client'

import { ComponentPropsWithoutRef, useMemo, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/shared/icons'

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface BusinessSwitcherProps extends PopoverTriggerProps {
  organizationData: Record<string, any>[]
}
export function BusinessSwitcher({ className, organizationData }: BusinessSwitcherProps) {
  const router = useRouter()

  const [switcherOpen, setSwitcherOpen] = useState(false)

  const params = useParams()

  if (!params) return null
  const { organizationId, businessId } = params

  const businessData = useMemo(() => {
    if (organizationId === 'dashboard') {
      return undefined
    }

    return organizationData.find((org) => org.id === organizationId)?.business
  }, [organizationId])

  const activeBusiness = businessData?.find((bus: any) => bus.id === businessId)

  if (!businessId) return null
  if (!activeBusiness) notFound()

  // if (!activeBusiness) {
  //   return (
  //     <Button
  //       variant='ghost'
  //       size='sm'
  //       role='combobox'
  //       aria-expanded={switcherOpen}
  //       aria-label='Select a workspace'
  //       className='w-52 justify-between opacity-50'
  //     >
  //       Select a business
  //       <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0' />
  //     </Button>
  //   )
  // }

  return (
    <div className='hidden md:flex'>
      <Icons.divider className='h-8 w-8 text-gray-200' />

      <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            role='combobox'
            aria-expanded={switcherOpen}
            aria-label='Select a business'
            className='relative w-[200px] justify-between'
          >
            {/* <div style={getRandomPatternStyle(businessId)} className='absolute inset-1 opacity-25' /> */}
            <span className='z-10 font-semibold'>{activeBusiness?.name}</span>
            <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search business...' />

              {businessData?.map((business: any) => (
                <CommandItem
                  key={business.id}
                  onSelect={() => {
                    setSwitcherOpen(false)
                    router.push(`/${organizationId}/${business.id}`)
                  }}
                  className={cn('text-sm', activeBusiness?.name === business.name ? 'font-medium' : 'font-normal')}
                >
                  {/* <div style={getRandomPatternStyle(business.id)} className='absolute inset-1 opacity-25' /> */}
                  {business.name}
                  <Check className={cn('ml-auto h-4 w-4', business.id === activeBusiness?.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    router.push(`/${organizationId}`)
                    setSwitcherOpen(false)
                  }}
                  className='cursor-pointer'
                >
                  <LayoutGrid className='mr-2 h-5 w-5' />
                  Browse business
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
