'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useZodForm } from '@/lib/zod-form'
import { CreateOrganizationDto, createOrganizationSchema } from '@/lib/schema'
import { createOrganization } from '@/actions/business'
import { Icons } from '@/components/shared/icons'

type OrganizationFormProps = {
  userId: string
}

export function OrganizationForm({ userId }: OrganizationFormProps) {
  const toaster = useToast()

  const [isPosting, setIsPosting] = useTransition()

  const form = useZodForm({ schema: createOrganizationSchema, defaultValues: { name: '' } })

  function onSubmit(data: CreateOrganizationDto) {
    try {
      setIsPosting(async () => {
        const result = await createOrganization({ ...data, userId })
        result && window.location.assign(`/${result.id}`)
        toaster.toast({
          title: 'Organization created',
          description: `Organization ${data.name} created successfully.`
        })
      })
    } catch (error) {
      toaster.toast({
        title: 'Error creating organization',
        variant: 'destructive',
        description: 'An issue occurred while creating your organization. Please try again.'
      })
    }
  }

  return (
    <div className='space-y-4 py-2 pb-4'>
      <div className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPosting} placeholder='Organization' {...field} />
                  </FormControl>
                  <FormDescription>A name to identify your organization in the dashboard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full items-center justify-end space-x-2 pt-6'>
              <Button type='submit' disabled={isPosting}>
                {isPosting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
                Create Organization
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
