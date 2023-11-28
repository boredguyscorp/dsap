'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { InputFieldForm } from './_components/InputFieldForm'
import { TextAreaForm } from './_components/TextAreaForm'

import { useZodForm } from '@/lib/zod-form'
import { Ownership, memberRegistrationFormSchema, memberRegistrationMergeSchema } from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button, buttonVariants } from '@/components/ui/button'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { DatePickerForm } from './_components/DatePickerForm'
import { DevTool } from '@hookform/devtools'

const RHFDevTool = dynamic(() => import('./_components/DevTools'), { ssr: false })

import dsapOffice from 'public/images/dsap-office.png'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'
import { FileUpload } from '@/components/editor/settings/file-upload'
import { registerMember } from '@/actions/members'
import {
  dpInvSystem,
  dpLocation,
  dpSetup,
  dpStoreHours,
  drugstoreClassType,
  membershipType,
  opStatus,
  ownershipType
} from '@/app/(app.domain.com)/dashboard/membership/_components/membership'

enum STEPS {
  GENERAL_INFO = 0,
  DRUGSTORE_PROFILE = 1,
  OWNER_PROFILE = 2,
  REGISTRATION_DETAIL = 3
}

export default function MembershipPage() {
  const steps = useMemo(
    () => [
      {
        label: 'General Information',
        icon: <Icons.home />
      },
      { label: 'Drugstore Profile', icon: <Icons.billing /> },
      { label: 'Owner Profile', icon: <Icons.laptop /> },
      { label: 'Registration Details', icon: <Icons.laptop /> }
      // { label: 'Step 4', icon: <Icons.bell /> },
      // { label: 'Step 5', icon: <Icons.download /> },
      // { label: 'Step 6', icon: <Icons.check /> }
    ],
    []
  )
  const [showForm, setShowForm] = useState(true)

  const [activeStep, setActiveStep] = useState(STEPS.GENERAL_INFO)

  const currentValidationSchema = memberRegistrationFormSchema[activeStep]

  const defaultValues = {
    drugStoreName: 'XXX Drugstore',
    address: 'zzz address',
    emailAdd: 'test@gmail.com',
    mobileNo: '123',
    ownershipType: 'single',
    membershipType: 'regular',
    drugstoreClass: 'regular',
    ownershipTypeDetails: { type: 'single' },
    opLastName: 'aaaLN',
    opFirstName: 'aaaFN'
  } as const

  const [isPending, startTransition] = useTransition()

  const form = useZodForm({
    schema: currentValidationSchema,
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

  // useEffect(() => {
  //   setFileUrl(watch('fdaUrlAttachment'))
  // }, [watch('fdaUrlAttachment')])

  // console.log(watch('fdaUrlAttachment'))
  // console.log('🚀 -> MembershipPage -> errors:', errors)

  if (!showForm) {
    return (
      <div className='mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16'>
        <div className='flex items-center justify-between gap-x-1.5 space-x-10 p-10 text-sm text-gray-600 decoration-2'>
          <div className='flex flex-col justify-center space-y-14'>
            <h2 className='text-3xl font-bold text-teal-600 dark:text-white md:text-4xl lg:text-5xl'>Benefits of becoming a member</h2>
            {/* <h5 className='text-xl font-semibold   text-teal-500 dark:text-gray-200 dark:group-hover:text-gray-400'>
              Benefits of becoming a member
            </h5> */}
            <ul className='max space-y-3 px-5 text-base font-semibold md:text-xl'>
              <li className='list-disc'>Get free educational programs for drugstore owners and pharmacy assistants</li>
              <li className='list-disc'>Get free reference book like MIMS and Better Pharmacy during DSAP Convention</li>
              <li className='list-disc'>The Drugstores get regular updates from FDA, DOH and other government agencies</li>
              <li className='list-disc'>Get specials rates from insurance companies accredited by DSAP for fore and theft</li>
              <li className='list-disc'>
                Get the privilege of using DSAP Logo in the signboard which projects the image of quality and compliance drugstore.
              </li>
              <li className='list-disc'>Participate in the DSAP convention with special rate</li>
              <li className='list-disc'>Learn about good business practice</li>
            </ul>
            {/* <p className='text-sm font-normal text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
              Complete form below to sign up for membership.
            </p> */}

            <Button
              variant='main'
              className='h-16'
              onClick={() => {
                setShowForm(true)
              }}
            >
              Proceed to Membership
            </Button>
          </div>
          <div className='hidden xl:block'>
            <Image src={dsapOffice} alt='Image Description' className='w-full rounded-xl object-cover' />
          </div>
        </div>
      </div>
    )
  }

  const onBack = () => {
    setActiveStep((value) => value - 1)
  }

  const onNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) setActiveStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (activeStep !== STEPS.REGISTRATION_DETAIL) {
      return onNext()
    }

    if (activeStep === STEPS.REGISTRATION_DETAIL) {
      // console.log(data)
      // console.log(' getValues:', getValues())

      const validationResult = memberRegistrationMergeSchema.safeParse(getValues())
      console.log('🚀 -> constonSubmit:SubmitHandler<FieldValues>= -> validationResult:', validationResult)

      if (!validationResult.success) throw new Error('Error Parsing Form Data.')

      startTransition(async () => {
        try {
          const response = await registerMember(validationResult.data)
          console.log('🚀 -> startTransition -> response:', response)

          // await new Promise((res) => setTimeout(() => res('sending...'), 1000))
        } catch (error) {
          console.error('ERROR: ', error)
          // setResponse({ success: false, message: 'Error sending inquiry! Please try again.' })
        }
      })
    }
  }

  function getStepContent(step: number) {
    switch (step) {
      case STEPS.GENERAL_INFO:
        return (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription className='mb-5'>Please fill up the form below. * is required.</CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className='mt-5'>
              <div className='space-y-4'>
                <InputFieldForm
                  control={form.control}
                  name='drugStoreName'
                  fieldProps={{ placeholder: 'Drugstore Name', required: true }}
                  extendedProps={{ label: 'Drugstore Name' }}
                />

                <TextAreaForm
                  control={form.control}
                  name='address'
                  fieldProps={{ placeholder: 'Address', required: true }}
                  extendedProps={{ label: 'Address' }}
                />

                <div className='grid grid-cols-3 gap-4'>
                  <InputFieldForm
                    control={form.control}
                    name='emailAdd'
                    fieldProps={{ placeholder: 'Email Address', required: true }}
                    extendedProps={{ label: 'Email Address' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='mobileNo'
                    fieldProps={{ placeholder: 'Mobile No.', required: true }}
                    extendedProps={{ label: 'Mobile No.' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='telNo'
                    fieldProps={{ placeholder: 'Telephone No.' }}
                    extendedProps={{ label: 'Telephone No.' }}
                  />
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='ownershipType'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Ownership Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            // onValueChange={(e) => {
                            //   field.onChange(e)
                            //   setValue('ownershipTypeDetails.type', e as Ownership)
                            // }}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='flex flex-col space-y-1'
                          >
                            {ownershipType.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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
                  <FormField
                    control={form.control}
                    name='membershipType'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Membership Type</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {membershipType.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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

                  <FormField
                    control={form.control}
                    name='drugstoreClass'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drugstore Classification</FormLabel>
                        <div className='relative w-full'>
                          <FormControl>
                            <select
                              className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                              {...field}
                            >
                              {drugstoreClassType.map((row) => (
                                <option key={row.value} value={row.value}>
                                  {row.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                        </div>
                        <FormDescription>Select to classify your Drugstore.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case STEPS.DRUGSTORE_PROFILE:
        return (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Drugstore Profile</CardTitle>
              <CardDescription className='mb-5'>Please fill up the form below. * is required.</CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className='mt-5'>
              <div className='space-y-4'>
                <div className='grid grid-cols-4 gap-4'>
                  <FormField
                    control={form.control}
                    name='dpSetup'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Setup</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {dpSetup.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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

                  <FormField
                    control={form.control}
                    name='dpLocation'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {dpLocation.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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

                  <FormField
                    control={form.control}
                    name='dpStoreHours'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Store Hours</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {dpStoreHours.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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

                  <FormField
                    control={form.control}
                    name='dpInvSystem'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Inventory System</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {dpInvSystem.map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case STEPS.OWNER_PROFILE:
        return (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Owners Profile</CardTitle>
              <CardDescription className='mb-5'>Please fill up the form below. * is required.</CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className='mt-5'>
              <div className='space-y-4'>
                <div className='grid grid-cols-3 gap-4'>
                  <InputFieldForm
                    control={form.control}
                    name='opLastName'
                    fieldProps={{ placeholder: 'Last Name', required: true }}
                    extendedProps={{ label: 'Last Name' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='opFirstName'
                    fieldProps={{ placeholder: 'First Name', required: true }}
                    extendedProps={{ label: 'First Name' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='opMiddleName'
                    fieldProps={{ placeholder: 'Middle Initial' }}
                    extendedProps={{ label: 'Middle Initial' }}
                  />
                </div>

                <TextAreaForm
                  control={form.control}
                  name='opAddress'
                  fieldProps={{ placeholder: 'Address' }}
                  extendedProps={{ label: 'Address' }}
                />

                <div className='grid grid-cols-2 gap-8'>
                  <div className='flex flex-col space-y-2'>
                    <DatePickerForm
                      control={form.control}
                      name='opBirthday'
                      fieldProps={{ mode: 'single' }}
                      extendedProps={{ label: 'Birthday', disabledFuture: true }}
                    />

                    <InputFieldForm
                      control={form.control}
                      name='opEmail'
                      fieldProps={{ placeholder: 'Email Add' }}
                      extendedProps={{ label: 'Email Add' }}
                    />
                  </div>

                  <div className='flex flex-col space-y-2'>
                    <InputFieldForm
                      control={form.control}
                      name='opCellNo'
                      fieldProps={{ placeholder: 'Cellphone No.' }}
                      extendedProps={{ label: 'Cellphone No.' }}
                    />
                    <InputFieldForm
                      control={form.control}
                      name='opTelNo'
                      fieldProps={{ placeholder: 'Telephone No.' }}
                      extendedProps={{ label: 'Telephone No.' }}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-8'>
                  <FormField
                    control={form.control}
                    name='opStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className='relative w-full'>
                          <FormControl>
                            <select
                              className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                              {...field}
                            >
                              {opStatus.map((row) => (
                                <option key={row.value} value={row.value}>
                                  {row.label}
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

                  <FormField
                    control={form.control}
                    name='opGender'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                            {[
                              { value: 'male', label: 'Male' },
                              { value: 'female', label: 'Female' }
                            ].map((row) => {
                              return (
                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                  <React.Fragment key={row.value}>
                                    <FormControl>
                                      <RadioGroupItem value={row.value} />
                                    </FormControl>
                                    <FormLabel className='font-normal'>{row.label}</FormLabel>
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
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case STEPS.REGISTRATION_DETAIL:
        return (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Registration Details and Attachment</CardTitle>
              <CardDescription className='mb-5'>Please fill up the form below. * is required.</CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className='mt-5 grid grid-cols-3 gap-10'>
              <div className='space-y-4'>
                <div className='flex flex-col gap-4'>
                  <InputFieldForm
                    control={form.control}
                    name='fdaLtoNo'
                    fieldProps={{ placeholder: 'FDA LTO No.', required: true }}
                    extendedProps={{ label: 'FDA LTO No.' }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='fdaDateIssued'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='fdaDateExpiry'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Expiry', required: true }}
                  />

                  <FileUpload
                    endpoint='pdfUploader'
                    value={watch('fdaUrlAttachment')}
                    onChange={(urlValue) => setValue('fdaUrlAttachment', urlValue ?? '')}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex flex-col gap-4'>
                  <InputFieldForm
                    control={form.control}
                    name='bpNo'
                    fieldProps={{ placeholder: 'Business Permit No.', required: true }}
                    extendedProps={{ label: 'Business Permit No.' }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='bpDateIssued'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='bpDateExpiry'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Expiry', required: true }}
                  />

                  <FileUpload
                    endpoint='pdfUploader'
                    value={watch('bpUrlAttachment')}
                    onChange={(urlValue) => setValue('bpUrlAttachment', urlValue ?? '')}
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex flex-col gap-4'>
                  <InputFieldForm
                    control={form.control}
                    name='docNo'
                    fieldProps={{ placeholder: 'Document No.', required: true }}
                    extendedProps={{ label: 'Document No.' }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='docDateIssued'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
                  />

                  <DatePickerForm
                    control={form.control}
                    name='docDateExpiry'
                    fieldProps={{ mode: 'single' }}
                    extendedProps={{ label: 'Date Expiry', required: true }}
                  />

                  <FileUpload
                    endpoint='pdfUploader'
                    value={watch('docUrlAttachment')}
                    onChange={(urlValue) => setValue('docUrlAttachment', urlValue ?? '')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return <>STEP D</>
      default:
        return 'Unknown step'
    }
  }

  return (
    <div className='mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16'>
      <div className='flex items-center justify-between gap-x-1.5 p-10 text-sm text-gray-600 decoration-2 hover:text-teal-500'>
        <div className='flex flex-col justify-center'>
          <h5 className='text-xl font-bold text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
            DSAP Membership Online Service
          </h5>
          <p className='text-sm font-normal text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
            Complete form below to sign up for membership.
          </p>
        </div>
      </div>
      <div className='p-5'>
        <div className='mx-4 p-4'>
          <div className='flex items-center'>
            {steps.map((step, index) => {
              return (
                <React.Fragment key={index}>
                  <div className={cn('relative flex items-center text-gray-500', activeStep === index && 'text-white')}>
                    <div
                      className={cn(
                        'h-12 w-12 rounded-full border-2 border-gray-300 bg-transparent py-3 transition duration-500 ease-in-out',
                        activeStep === index && 'border-teal-600 bg-teal-600',
                        activeStep > index && 'border-teal-600'
                      )}
                    >
                      <div
                        className={cn(
                          'flex w-full items-center justify-center text-gray-500',
                          activeStep === index && 'text-white',
                          activeStep > index && 'text-teal-600'
                        )}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-teal-600',
                        activeStep < index && 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out',
                        activeStep > index && 'border-teal-600'
                      )}
                    ></div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <div className='mt-8 p-4'>
          <Form {...form}>
            <form className='mt-10 space-y-4 '>{getStepContent(activeStep)}</form>
          </Form>
          <div className='mt-10 flex p-2'>
            <button
              className={cn(
                'flex cursor-pointer justify-center rounded border bg-gray-100 px-4 py-2 text-base font-bold text-gray-700  transition duration-200 ease-in-out focus:outline-none enabled:border-gray-400 enabled:hover:scale-110 enabled:hover:bg-gray-200',
                activeStep === STEPS.GENERAL_INFO && 'cursor-not-allowed'
              )}
              disabled={activeStep === STEPS.GENERAL_INFO}
              onClick={() => onBack()}
            >
              Previous
            </button>
            <div className='flex flex-auto flex-row-reverse'>
              <button
                className={cn(
                  'ml-2 flex min-w-[150px]  cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none enabled:hover:scale-110 enabled:hover:bg-teal-600',
                  isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                )}
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                // onClick={onNext}
              >
                {activeStep === STEPS.REGISTRATION_DETAIL ? (isPending ? 'Submitting Application' : 'Submit Application') : 'Next'}
              </button>
            </div>
          </div>
        </div>

        <RHFDevTool control={form.control} />
      </div>
    </div>
  )
}
