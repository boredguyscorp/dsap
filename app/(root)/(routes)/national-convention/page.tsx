'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { InputFieldForm } from '../membership/_components/InputFieldForm'
import { TextAreaForm } from '../membership/_components/TextAreaForm'

import { useZodForm } from '@/lib/zod-form'
import {
  ConventionRegistrationForm,
  Ownership,
  ConventionRegistrationFormSchema,
  MemberRegistrationFormSchema,
  MmemberRegistrationMergeSchema,
  title
} from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button, buttonVariants } from '@/components/ui/button'
import { CalendarIcon, ChevronDownIcon, MapPin } from 'lucide-react'
// import { DatePickerForm } from './_components/DatePickerForm'

const RHFDevTool = dynamic(() => import('../membership/_components/DevTools'), { ssr: false })

import dsap25th from 'public/images/dsap25th.jpg'
// import logo from 'public/images/logo.jpg'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FileUpload } from '@/components/editor/settings/file-upload'

import Balancer from 'react-wrap-balancer'
import { Label } from '@/components/ui/label'
import { typeValues } from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
import { registerConvention } from '@/actions/convention'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function NationalConventionPage() {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const defaultValues = {
    convention: '25th',
    type: 'm',
    firstName: 'BG',
    lastName: 'Dev',
    contactNo: '+63 123 456 789',
    emailAdd: 'bginside.dev@gmail.com'
    // proofOfPaymentUrl: 'https://uploadthing.com/'
  } as const

  const [isPending, startTransition] = useTransition()
  const [response, setResponse] = useState<{ success: boolean; message: string }>()

  const form = useZodForm({
    schema: ConventionRegistrationFormSchema,
    defaultValues,
    shouldUnregister: false
  })

  const {
    reset,
    setError,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger
  } = form

  // console.log('🚀 -> NationalConventionPage -> errors:', errors)

  if (!showForm) {
    return (
      <div className='mx-auto mt-32 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
        <div className='md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32'>
          <div>
            <Image src={dsap25th} alt='dsap-national-convention-25th' className='w-full rounded-xl object-cover' />
          </div>

          <div className='mt-5 sm:mt-10 lg:mt-0'>
            <div className='space-y-6 sm:space-y-8'>
              <div className='space-y-2 md:space-y-4'>
                <p className='text-lg'>
                  <Balancer>
                    Those who wish to join <span className='font-bold'>DSAP Convention 2024</span> shall submit registration together with
                    the corresponding fee and requirements.
                  </Balancer>
                </p>
              </div>

              <h2 className='text-2xl font-bold text-teal-600 dark:text-white md:text-3xl lg:text-4xl'>How to Register</h2>

              <ol className='max space-y-3  px-6 text-base font-semibold md:text-lg'>
                <li className='list-decimal'>Fill up required fields.</li>
                <ul className='max space-y-3 px-5  font-semibold'>
                  <li className='list-disc'>First Name</li>
                  <li className='list-disc'>Last Name</li>
                  <li className='list-disc'>Contact No.</li>
                  <li className='list-disc'>Email Address</li>
                </ul>

                <li className='list-decimal'>Upload Proof of Payment</li>
                <li className='list-decimal'>Submit Registration Form</li>
                <li className='list-decimal'>Wait for the Email Confirmation</li>
              </ol>

              <Button
                variant='main'
                className='h-16 w-64'
                onClick={() => {
                  setShowForm(true)
                }}
              >
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      // <div className='mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16'>
      //   <div className='flex items-center justify-between gap-x-1.5 space-x-10 p-10 text-sm text-gray-600 decoration-2'>
      //     <div className='flex flex-col justify-center space-y-14'>
      //       <h2 className='text-2xl font-bold text-teal-600 dark:text-white md:text-3xl lg:text-4xl'>How to Register</h2>
      //       {/* <h5 className='text-xl font-semibold   text-teal-500 dark:text-gray-200 dark:group-hover:text-gray-400'>
      //         Benefits of becoming a member
      //       </h5> */}

      // <ol className='max space-y-3 px-5 text-base font-semibold md:text-xl'>
      //   <li className='list-decimal'>Fill up required fields.</li>
      //   <ul className='max space-y-3 px-5 text-base font-semibold md:text-xl'>
      //     <li className='list-disc'>First Name</li>
      //     <li className='list-disc'>Last Name</li>
      //     <li className='list-disc'>Contact No.</li>
      //     <li className='list-disc'>Mobile No.</li>
      //     <li className='list-disc'>Email Address</li>
      //   </ul>

      //   <li className='list-decimal'>Upload Proof of Payment</li>
      //   <li className='list-decimal'>Submit Registration Form</li>
      //   <li className='list-decimal'>Wait for the Email Confirmation</li>
      // </ol>

      //       <Button
      //         variant='main'
      //         className='h-16'
      //         onClick={() => {
      //           setShowForm(true)
      //         }}
      //       >
      //         Proceed to Registration
      //       </Button>
      //     </div>
      //     <div className='hidden xl:block'>
      //       <Image src={dsap25th} alt='dsap-national-convention-25th' className='w-full rounded-xl object-cover' />
      //     </div>
      //   </div>
      // </div>
    )
  }

  const onSubmit: SubmitHandler<ConventionRegistrationForm> = async (data) => {
    // console.log('🚀 -> constonSubmit:SubmitHandler<ConventionRegistrationForm>= -> data:', data)
    startTransition(async () => {
      try {
        const response = await registerConvention(data)
        // console.log('🚀 -> startTransition -> response:', response)
        // await new Promise((res) => setTimeout(() => res('sending...'), 1000))
        setResponse({ success: true, message: 'Successfully submitted your registration.' })
        toast.success('Successfully submitted your registration', { position: 'top-center' })

        // setShowForm(false)

        // setTimeout(() => {
        //   // router.refresh()
        //   // setShowForm(false)
        //   window.location.reload()
        // }, 3000)
      } catch (error) {
        console.error('ERROR: ', error)
        setResponse({ success: false, message: 'Error submitting registration! Please try again.' })
        toast.error('Error submitting registration! Please try again.', { position: 'top-center' })
      }
    })
  }

  return (
    // <div className="w-full bg-[url('/images/logo.png')] bg-[length:500px_500px]">
    <div className='w-full bg-gradient-to-br from-teal-400 to-cyan-100'>
      <div className='mx-auto mt-32 max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
        <div className='p-5'>
          <div className='p-4'>
            <Form {...form}>
              <form className='space-y-4 '>
                <Card className='w-full'>
                  <CardHeader>
                    <CardTitle>Convention Registration Form</CardTitle>
                    <CardDescription className='mb-5'>
                      Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
                    </CardDescription>
                  </CardHeader>
                  <Separator />

                  <CardContent className='mt-5'>
                    <div className='space-y-5'>
                      <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            {/* <FormLabel>Ownership Type</FormLabel> */}
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex items-center space-x-2'>
                                {typeValues.map((row) => {
                                  return (
                                    <FormItem key={row.value} className='flex items-center space-x-3 space-y-0'>
                                      <React.Fragment key={row.value}>
                                        <FormControl>
                                          <RadioGroupItem value={row.value} />
                                        </FormControl>
                                        <FormLabel className={cn('font-normal', row.value === field.value && 'font-semibold')}>
                                          {row.label}
                                        </FormLabel>
                                      </React.Fragment>
                                    </FormItem>
                                  )
                                })}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='space-y-2'>
                        <Label>Personal Information</Label>
                        <FormField
                          control={form.control}
                          name='title'
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Status</FormLabel> */}
                              <div className='relative w-full'>
                                <FormControl>
                                  <select
                                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                                    placeholder='Select Title'
                                    {...field}
                                  >
                                    {title.map((row) => (
                                      <option key={row} value={row}>
                                        {row}
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                              </div>
                              {/* <FormDescription>Select Owner Status.</FormDescription> */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <InputFieldForm
                          control={form.control}
                          name='firstName'
                          fieldProps={{ placeholder: 'First Name', required: true }}
                        />
                        <InputFieldForm control={form.control} name='middleName' fieldProps={{ placeholder: 'Middle Name' }} />
                        <InputFieldForm control={form.control} name='lastName' fieldProps={{ placeholder: 'Last Name', required: true }} />

                        <InputFieldForm
                          control={form.control}
                          name='contactNo'
                          fieldProps={{ placeholder: 'Contact No.', required: true }}
                        />
                        <InputFieldForm
                          control={form.control}
                          name='emailAdd'
                          fieldProps={{ placeholder: 'Email Address', required: true, type: 'email' }}
                        />
                      </div>

                      <Separator />
                      <div className='space-y-2'>
                        <Label>Address</Label>
                        <InputFieldForm control={form.control} name='address.street' fieldProps={{ placeholder: 'No./Street' }} />
                        <InputFieldForm control={form.control} name='address.brgy' fieldProps={{ placeholder: 'Barangay' }} />
                        <InputFieldForm control={form.control} name='address.city' fieldProps={{ placeholder: 'City' }} />
                        <InputFieldForm control={form.control} name='address.province' fieldProps={{ placeholder: 'Province' }} />
                      </div>

                      <Separator />
                      <div className='space-y-2'>
                        <Label>Drugstore Information</Label>
                        <InputFieldForm
                          control={form.control}
                          name='drugstoreInfo.establishment'
                          fieldProps={{ placeholder: 'Establishment Represented' }}
                        />
                        <InputFieldForm control={form.control} name='drugstoreInfo.chapter' fieldProps={{ placeholder: 'Chapter' }} />
                        <InputFieldForm
                          control={form.control}
                          name='drugstoreInfo.owner'
                          fieldProps={{ placeholder: 'Owner of Drugstore/Establishment' }}
                        />
                        <InputFieldForm
                          control={form.control}
                          name='drugstoreInfo.mainAddress'
                          fieldProps={{ placeholder: 'Main Address' }}
                        />
                      </div>

                      <Separator />
                      <div className='space-y-2'>
                        <Label className={cn('font-medium', !watch('proofOfPaymentUrl') && errors.proofOfPaymentUrl && 'text-red-500')}>
                          Proof of Payment {!watch('proofOfPaymentUrl') && errors.proofOfPaymentUrl ? ' is required.' : '*'}
                        </Label>
                        <FileUpload
                          endpoint='pdfUploader'
                          value={watch('proofOfPaymentUrl')}
                          onChange={(urlValue) => setValue('proofOfPaymentUrl', urlValue ?? '')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>

            {response ? (
              <div
                className='mt-10 flex cursor-pointer justify-center text-center'
                onClick={() => {
                  window.location.reload()
                }}
              >
                <p
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 text-lg font-bold text-teal-600',
                    !response.success && 'text-red-600'
                  )}
                >
                  <div className='flex items-center gap-2'>
                    {response.message}
                    <span>{response.success && <Icons.check className='mr-2 h-6 w-6' />}</span>
                  </div>

                  {response.success && (
                    <span className='inline-flex items-center justify-center gap-x-2 text-xs font-semibold text-gray-800 decoration-2 group-hover:underline sm:text-sm '>
                      Click here to create new registration.
                      {/* <ChevronRight className='h-4 w-4' /> */}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className='mt-10 flex items-center p-2'>
                <div>
                  <p>Registration Fee:</p>
                  <Label className='text-xl font-semibold text-teal-600'>{typeValues.find((r) => r.value === watch('type'))?.label}</Label>
                </div>
                <div className='flex flex-auto flex-row-reverse'>
                  <button
                    className={cn(
                      'ml-2 flex h-16 min-w-[150px] cursor-pointer items-center justify-center rounded border border-teal-500 bg-teal-500 px-4 py-2 text-lg font-semibold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:bg-teal-400',
                      isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                    )}
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isPending}
                    // onClick={onNext}
                  >
                    {isPending ? 'Submitting Registration' : 'Submit Registration'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <RHFDevTool control={form.control} />
        </div>
      </div>
    </div>
  )
}
