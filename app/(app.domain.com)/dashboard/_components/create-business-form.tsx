'use client'

import { useRouter } from 'next/navigation'

import { useTransition } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { useZodForm } from '@/lib/zod-form'
import { Button } from '@/components/ui/button'

import { createBusiness } from '@/actions/business'
import { Icons } from '@/components/shared/icons'
import { CreateBusinessDto, createBusinessSchema } from '@/lib/schema'

// import db from '@/lib/db'

type BusinessFormProps = { organizationId: string }

export function BusinessForm(props: BusinessFormProps) {
  const toaster = useToast()

  const [isPosting, setIsPosting] = useTransition()

  const form = useZodForm({ schema: createBusinessSchema, defaultValues: { name: '' } })

  function onSubmit(data: CreateBusinessDto) {
    try {
      setIsPosting(async () => {
        const result = await createBusiness({ ...data, organizationId: props.organizationId })

        // router.push(`/${props.organizationId}/${result.id}`)
        window.location.assign(`/${props.organizationId}/${result.id}`)

        toaster.toast({
          title: 'Business created',
          description: `Business ${data.name} created successfully.`
        })
      })
    } catch (error) {
      toaster.toast({
        title: 'Error creating business',
        variant: 'destructive',
        description: 'An issue occurred while creating your business. Please try again.'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder='ABC Corp.' />
              </FormControl>
              <FormDescription>A name to identify your business in the dashboard.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isPosting}>
          {isPosting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
          Create Business
        </Button>
      </form>
    </Form>
  )
}
