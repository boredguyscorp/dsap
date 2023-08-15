'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { add, format } from 'date-fns'
import { CalendarIcon, ChevronsUpDown } from 'lucide-react'

// import type { CreateApiKey } from '@acme/api/validators'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useZodForm } from '@/lib/zod-form'
import { useToast } from '@/components/ui/use-toast'
import { CreateLocationDto, createLocationSchema } from '@/lib/schema'
import { useState, useTransition } from 'react'
import { Icons } from '@/components/shared/icons'
import { createLocation } from '@/actions/location'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LocationForm() {
  const toaster = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  if (!params) return null

  const { businessId, organizationId } = params as { businessId: string; organizationId: string }

  const [isPosting, setIsPosting] = useTransition()

  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useZodForm({
    schema: createLocationSchema,
    defaultValues: { name: '', businessId, organizationId }
  })

  function onSubmit(data: CreateLocationDto) {
    try {
      setIsPosting(async () => {
        await createLocation(data, { pathname: pathname! })

        form.reset()
        router.refresh()
        setDialogOpen(false)

        toaster.toast({
          title: 'Location Created',
          description: `Location '${data.name}' created successfully.`
        })
      })
    } catch (error) {
      toaster.toast({
        title: 'Error creating Location',
        variant: 'destructive',
        description: 'An issue occurred while creating location. Please try again.'
      })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Location</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
          <DialogDescription>Fill out the form to create an Location.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Location Name' />
                  </FormControl>
                  <FormDescription>A name to identify your location in the dashboard. .</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name='expiresIn'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Expires in</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? optExpiresIn.find((expIn) => expIn.value === field.value)?.label : 'Select expiration'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput placeholder='Search expiration...' />
                        <CommandEmpty>No expiration found.</CommandEmpty>
                        <CommandGroup>
                          {optExpiresIn.map((expIn) => (
                            <CommandItem
                              value={expIn.label}
                              key={expIn.value}
                              onSelect={() => {
                                form.setValue('expiresIn', expIn.value)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', expIn.value === field.value ? 'opacity-100' : 'opacity-0')} />
                              {expIn.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className='flex justify-end'>
              <Button type='submit' disabled={isPosting}>
                {isPosting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
                Create Location
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
