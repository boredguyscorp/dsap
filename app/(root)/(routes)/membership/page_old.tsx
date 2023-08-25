import React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/shared/icons'

export default function MembershipPage() {
  return (
    <div className='mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16'>
      <div className='grid gap-y-8 md:gap-x-6 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0'>
        <div className='mt-10 lg:col-span-2'>
          <div className='mb-10 space-y-3'>
            <div className='flex items-center justify-between gap-x-1.5 text-sm text-gray-600 decoration-2 hover:text-teal-500'>
              <div className='flex flex-col justify-center'>
                <h5 className='text-xl font-bold text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
                  DSAP Membership Online Service
                </h5>
                <p className='text-sm font-normal text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
                  Complete form below to sign up for membership.
                </p>
              </div>
              <div>
                <Button variant='main' size='sm' className='p-5 text-lg'>
                  Submit Application
                </Button>
              </div>
            </div>
            <div className='min-h-screen'>
              <Tabs defaultValue='General Information' className='relative mr-auto mt-11 w-full '>
                <div className='flex items-center justify-between pb-3'>
                  <TabsList className='grid min-h-[50px] w-full grid-cols-4 justify-start'>
                    <TabsTrigger value='General Information' className='text-lg'>
                      General Information
                    </TabsTrigger>
                    <TabsTrigger value='Drugstore Profile' className='text-lg'>
                      Drugstore Profile
                    </TabsTrigger>
                    <TabsTrigger value='Owners Profile' className='text-lg'>
                      Owners Profile
                    </TabsTrigger>
                    <TabsTrigger value='Educational Attainment' className='text-lg'>
                      Educational Attainment
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value='General Information' className='min-h-screen rounded-md border'>
                  <>General Information</>
                </TabsContent>
                <TabsContent value='Drugstore Profile' className='min-h-screen rounded-md border'>
                  <>Drugstore Profile</>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <div className='p-6 dark:from-slate-800 lg:col-span-1 lg:h-full lg:w-full lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent'>
          <div className='sticky left-0 top-0 py-8 md:pl-4 lg:pl-8'>
            <div className='group mb-8 mt-20 flex items-center gap-x-3 border-b border-gray-200 pb-8 dark:border-gray-700'>
              <div className='block grow'>
                <a className='flex cursor-pointer items-center text-lg font-bold text-gray-800 group-hover:text-teal-500 dark:text-gray-200 dark:group-hover:text-gray-400'>
                  <Icons.link className='mr-2' /> Click here to view membership guide
                </a>
              </div>
            </div>

            <div className='space-y-6 font-semibold'>
              <a className='flex cursor-pointer items-center text-sm text-gray-800 hover:text-teal-500 dark:text-gray-200 dark:hover:text-blue-500'>
                <Icons.check className='mr-3' />
                Check your application
              </a>
              <a className='flex cursor-pointer items-center text-sm text-gray-800 hover:text-teal-500 dark:text-gray-200 dark:hover:text-blue-500'>
                <Icons.download className='mr-3' />
                Download Membership Form
              </a>
              <a className='flex cursor-pointer items-center text-sm text-gray-800 hover:text-teal-500 dark:text-gray-200 dark:group-hover:text-blue-500'>
                <Icons.userCheck className='mr-3' />
                Renewal of Membership
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
