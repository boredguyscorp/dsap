'use client'
import { useTransition } from 'react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { useZodForm } from '@/lib/zod-form'

import { UpdateBusinessDto, updateBusinessSchema } from '@/lib/schema'
import { updateOrganization } from '@/actions/business'
import { Icons } from '@/components/shared/icons'

export function OrganizationName(props: { currentName: string; organizationId: string }) {
  const { organizationId, currentName } = props

  const toaster = useToast()
  const pathname = usePathname()

  const [isPosting, setIsPosting] = useTransition()

  const form = useZodForm({
    schema: updateBusinessSchema,
    defaultValues: {
      id: organizationId,
      name: currentName
    }
  })

  function onSubmit(data: UpdateBusinessDto) {
    try {
      setIsPosting(async () => {
        await updateOrganization(data, { pathname: pathname! })

        toaster.toast({
          title: 'Organization name updated',
          description: `Your organization ${data.name} has been updated.`
        })
      })
    } catch (error) {
      toaster.toast({
        title: 'Error updating organization',
        variant: 'destructive',
        description: 'An issue occurred while updating your organization. Please try again.'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Name</CardTitle>
        <CardDescription>Change the name of your organization</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-2'>
          <CardContent>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={organizationId.length > 0 ? currentName : 'loading...'} />
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
