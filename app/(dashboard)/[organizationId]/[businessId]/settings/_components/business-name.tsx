'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

import { useZodForm } from '@/lib/zod-form'
import { UpdateBusinessDto, updateBusinessSchema } from '@/lib/schema'
import { updateBusiness } from '@/actions/business'
import { Icons } from '@/components/shared/icons'

export function BusinessName(props: { currentName: string; businessId: string }) {
  const { businessId, currentName } = props
  const toaster = useToast()
  const [isPosting, setIsPosting] = React.useTransition()

  const form = useZodForm({
    schema: updateBusinessSchema,
    defaultValues: {
      id: businessId,
      name: currentName
    }
  })

  function onSubmit(data: UpdateBusinessDto) {
    try {
      setIsPosting(async () => {
        await updateBusiness(data)

        toaster.toast({
          title: 'Business name updated',
          description: `Your business ${data.name} has been updated.`
        })
      })
    } catch (error) {
      toaster.toast({
        title: 'Error updating business',
        variant: 'destructive',
        description: 'An issue occurred while updating your business. Please try again.'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business name</CardTitle>
        <CardDescription>Change the display name of your business</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CardContent>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={businessId.length > 0 ? currentName : 'loading...'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type='submit' className='ml-auto' disabled={isPosting}>
              {isPosting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
              Update
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
