'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import React, { useMemo, useState, useTransition } from 'react'

import { Form } from '@/components/ui/form'

import { useZodForm } from '@/lib/zod-form'
import { MemberRegistrationFormSchema, MemberRegistrationMergeSchema } from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'

import { Button } from '@/components/ui/button'

const RHFDevTool = dynamic(() => import('../../../../components/forms/DevTools'), { ssr: false })

import dynamic from 'next/dynamic'

import { registerMember } from '@/actions/members'

import { STEPS } from './_components/constant'
import { getFormStepContent } from './_components/form-content'
import { MembershipLanding } from './_components/landing'

export default function MembershipPage() {
  const showBanner = process.env.NEXT_PUBLIC_SHOW_BANNER === 'true'

  const steps = useMemo(
    () => [
      {
        label: 'General Information',
        icon: <Icons.home />
      },
      { label: 'Drugstore Profile', icon: <Icons.store /> },
      { label: 'Owner Profile', icon: <Icons.user /> },
      { label: 'Registration Details', icon: <Icons.docs /> },
      { label: 'Review Information', icon: <Icons.checkCheck /> }
    ],
    []
  )
  const [showForm, setShowForm] = useState(true)
  const [activeStep, setActiveStep] = useState(STEPS.REVIEW_INFORMATION)

  const currentValidationSchema = MemberRegistrationFormSchema[activeStep]

  const defaultValues = {
    drugStoreName: 'XXX Drugstore',
    address: 'zzz address',
    emailAdd: 'test@gmail.com',
    mobileNo: '123',
    ownershipType: 'single proprietor',
    membershipType: 'regular',
    drugstoreClass: 'regular',
    dpSetup: 'counter type',
    dpLocation: 'hospital',
    dpStoreHours: '24 Hrs',
    dpInvSystem: 'others',
    ownershipTypeDetails: { type: 'single' },
    opLastName: 'aaaLN',
    opFirstName: 'aaaFN',
    fdaLtoNo: 'FDA123',
    fdaDateIssued: new Date(),
    fdaDateExpiry: new Date(),
    fdaUrlAttachment: 'https://uploadthing.com/f/eb031187-82bf-4783-be1e-a1af2c53c7b1-vv7o4m.pdf'
  } as const

  const [isPending, startTransition] = useTransition()

  const form = useZodForm({
    schema: currentValidationSchema,
    defaultValues,
    shouldUnregister: false
  })

  const { getValues, trigger } = form

  if (!showForm) {
    return <MembershipLanding setShowForm={setShowForm} />
  }

  const onBack = () => {
    setActiveStep((value) => value - 1)
  }

  const onNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) setActiveStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (activeStep !== STEPS.REVIEW_INFORMATION) {
      return onNext()
    }

    if (activeStep === STEPS.REVIEW_INFORMATION) {
      // console.log(data)
      // console.log(' getValues:', getValues())

      const validationResult = MemberRegistrationMergeSchema.safeParse(getValues())

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

  return (
    <div className={cn('mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16', showBanner && 'mt-36')}>
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
                  <div
                    onClick={() => (activeStep > index ? setActiveStep(index) : undefined)}
                    className={cn(
                      'relative flex items-center text-gray-500',
                      activeStep === index && 'text-white',
                      activeStep > index && 'cursor-pointer'
                    )}
                  >
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
            <form className='mt-10 space-y-4 '>{getFormStepContent({ activeStep, setActiveStep })}</form>
          </Form>
          <div className='mt-10 flex items-center justify-end  p-2'>
            {activeStep > 0 && (
              <button
                className={cn(
                  'flex min-w-[150px] cursor-pointer justify-center rounded border bg-gray-100 px-4 py-2 text-base font-bold text-gray-700  transition duration-200 ease-in-out focus:outline-none enabled:border-gray-400  enabled:hover:bg-gray-200',
                  activeStep === STEPS.GENERAL_INFO && 'cursor-not-allowed'
                )}
                disabled={activeStep === STEPS.GENERAL_INFO}
                onClick={() => onBack()}
              >
                Previous
              </button>
            )}

            {/* <div className='flex flex-auto flex-row-reverse'> */}
            <div className='flex'>
              <button
                className={cn(
                  'ml-2 flex min-w-[150px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                  isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                )}
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                // onClick={onNext}
              >
                {activeStep < 3 && 'Next'}
                {activeStep === STEPS.REGISTRATION_DETAIL && 'Review Information'}
                {activeStep === STEPS.REVIEW_INFORMATION && (isPending ? 'Submitting Application' : 'Submit Application')}
              </button>
            </div>
          </div>
        </div>

        <RHFDevTool control={form.control} />
      </div>
    </div>
  )
}
