'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { InputFieldForm } from './_components/InputFieldForm'
import { TextAreaForm } from './_components/TextAreaForm'

import { useZodForm } from '@/lib/zod-form'
import { newMemberSchema } from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button, buttonVariants } from '@/components/ui/button'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { DatePickerForm } from './_components/DatePickerForm'

enum STEPS {
  A = 0,
  B = 1,
  C = 2,
  D = 3
}

export default function MembershipPage() {
  const steps = useMemo(
    () => [
      {
        label: 'General Information',
        icon: <Icons.home />
      },
      { label: 'Registration Details', icon: <Icons.laptop /> },
      { label: 'Drugstore Profile', icon: <Icons.billing /> },
      { label: 'Owner Profile', icon: <Icons.laptop /> }
      // { label: 'Step 4', icon: <Icons.bell /> },
      // { label: 'Step 5', icon: <Icons.download /> },
      // { label: 'Step 6', icon: <Icons.check /> }
    ],
    []
  )

  const ownershipType = [
    { value: 'single', label: 'Single Proprietor' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'corporation', label: 'Corporation' }
  ]

  const membershipType = [
    { value: 'regular', label: 'Regular' },
    { value: 'associate', label: 'Associate' }
  ]

  const drugstoreClassType = [
    { value: 'regular', label: 'Regular' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'chain', label: 'Chain' },
    { value: 'franchisor', label: 'Franchisor' },
    { value: 'wholesaler', label: 'Wholesaler' }
  ]

  const [activeStep, setActiveStep] = useState(STEPS.A)

  const defaultValues = {
    drugStoreName: '',
    ownerFirstName: '',
    ownerLastName: '',
    test: ''
  }

  const currentValidationSchema = newMemberSchema[activeStep]

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
    setValue,
    trigger
  } = form

  // console.log('🚀 -> MembershipPage -> errors:', errors)

  const onBack = () => {
    setActiveStep((value) => value - 1)
  }

  const onNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) setActiveStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (activeStep !== STEPS.D) {
      return onNext()
    }

    if (activeStep === STEPS.D) {
      // console.log(data)
      console.log(' getValues:', getValues())
    }
  }

  function getStepContent(step: number) {
    switch (step) {
      case STEPS.B:
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
                    fieldProps={{ placeholder: 'Email Address' }}
                    extendedProps={{ label: 'Email Address' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='telNo'
                    fieldProps={{ placeholder: 'Telephone No.' }}
                    extendedProps={{ label: 'Telephone No.' }}
                  />
                  <InputFieldForm
                    control={form.control}
                    name='mobileNo'
                    fieldProps={{ placeholder: 'Mobile No.' }}
                    extendedProps={{ label: 'Mobile No.' }}
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
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
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
                    name='drugstoreClassification'
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
      case STEPS.A:
        return (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
              <CardDescription className='mb-5'>Please fill up the form below. * is required.</CardDescription>
            </CardHeader>
            <Separator />

            <CardContent className='mt-5'>
              <div className='space-y-4'>
                <div className='grid grid-cols-4 gap-4'>
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

                  <InputFieldForm
                    control={form.control}
                    name='fdaUrlAttachment'
                    fieldProps={{ placeholder: 'Attachment', required: true }}
                    extendedProps={{ label: 'Attachment' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case STEPS.C:
        return (
          <>
            <FormField
              control={form.control}
              name='ownerFirstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} value={getValues('ownerFirstName')} placeholder='Owner First Name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ownerLastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} value={getValues('ownerLastName')} placeholder='Owner Last Name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case STEPS.D:
        return (
          <>
            <FormField
              control={form.control}
              name='test'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test *</FormLabel>
                  <FormControl>
                    <Input {...field} value={getValues('test')} placeholder='Test' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
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
                activeStep === STEPS.A && 'cursor-not-allowed'
              )}
              disabled={activeStep === STEPS.A}
              onClick={() => onBack()}
            >
              Previous
            </button>
            <div className='flex flex-auto flex-row-reverse'>
              <button
                className='ml-2 flex min-w-[150px]  cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out hover:scale-110 hover:bg-teal-600 focus:outline-none'
                onClick={form.handleSubmit(onSubmit)}
                // onClick={onNext}
              >
                {activeStep === STEPS.D ? 'Submit Application' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
