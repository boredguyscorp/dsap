'use client'

import { Icons } from '@/components/shared/icons'
import { cn, convertStringDatesPropToDates } from '@/lib/utils'
import React, { useMemo, useState, useTransition } from 'react'

import { Form } from '@/components/ui/form'

import { useZodForm } from '@/lib/zod-form'
import {
  MemberGeneralInfo,
  MemberRegistrationForm,
  MemberRegistrationFormSchema,
  MemberRegistrationMergeSchema,
  uploadPayment
} from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'

const RHFDevTool = dynamic(() => import('../../../../../components/forms/DevTools'), { ssr: false })

import dynamic from 'next/dynamic'

import { MemberEntity, registerMember, updateMember } from '@/actions/members'

import { STEPS } from './constant'
import { getFormStepContent } from './form-content'
import { MembershipLanding } from './landing'
import { ChapterList } from '@/actions/fetchers'
import { useParams, useRouter } from 'next/navigation'

import MemberAuth from './member-auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export type MembershipFormProps = {
  chapters: ChapterList
  memberDetails?: MemberEntity
  showFormDefaultValue?: boolean
  className?: string
  showFormHeader?: boolean
  isModalForm?: boolean
  onClose?: () => void
}

export default function MembershipForm({
  chapters,
  memberDetails,
  showFormDefaultValue,
  className,
  showFormHeader = true,
  isModalForm = false,
  onClose
}: MembershipFormProps) {
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
      { label: 'Review Information', icon: <Icons.checkCheck /> },
      { label: 'Upload Payment', icon: <Icons.billing /> }
    ],
    []
  )
  const [showForm, setShowForm] = useState(showFormDefaultValue || memberDetails ? true : false)
  const [showMemberAuthForm, setShowMemberAuthForm] = useState(false)
  const [activeStep, setActiveStep] = useState(STEPS.GENERAL_INFO)

  const currentValidationSchema = activeStep > 4 ? uploadPayment : MemberRegistrationFormSchema[activeStep < 4 ? activeStep : 0]

  const defaultValues: MemberRegistrationForm = {
    drugStoreName: '',
    chapter: '',
    address: '',
    emailAdd: '',
    mobileNo: '',
    dpDateEstablished: new Date(),
    ownershipType: 'single proprietor',
    membershipType: 'regular',
    drugstoreClass: '',
    // ownershipType: 'single proprietor',
    // membershipType: 'regular',
    // drugstoreClass: 'single',
    // ownershipTypeDetails: { type: 'single' },
    opLastName: '',
    opFirstName: '',
    opPhImageUrl: '',
    fdaLtoNo: '',
    fdaDateIssued: new Date(),
    fdaDateExpiry: new Date(),
    fdaUrlAttachment: '',
    bpNo: '',
    bpDateIssued: new Date(),
    bpDateExpiry: new Date(),
    bpUrlAttachment: '',
    docNo: '',
    docDateIssued: new Date(),
    docDateExpiry: new Date(),
    docUrlAttachment: '',
    opDsapMember: { opDsapMemberType: 'owner' }
  } as const

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useZodForm({
    schema: currentValidationSchema,
    defaultValues: memberDetails ? convertStringDatesPropToDates(memberDetails ?? {}) : defaultValues,
    shouldUnregister: false
  })

  const {
    getValues,
    trigger,
    formState: { errors },
    watch
  } = form

  if (showMemberAuthForm) {
    return <MemberAuth setShowMemberAuthForm={setShowMemberAuthForm} setShowForm={setShowForm} />
  }

  if (!showForm && !showMemberAuthForm) {
    return <MembershipLanding setShowForm={setShowForm} setShowMemberAuthForm={setShowMemberAuthForm} />
  }

  const onBack = () => {
    setActiveStep((value) => value - 1)
  }

  const onNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) setActiveStep((value) => value + 1)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (activeStep !== STEPS.UPLOAD_PAYMENT) {
      return onNext()
    }

    // if (activeStep === STEPS.REVIEW_INFORMATION) {
    //   setActiveStep((value) => value + 1)
    //   console.log('zzzzzzzzzz')
    //   return
    // }

    if (activeStep === STEPS.UPLOAD_PAYMENT) {
      // console.log(data)
      // console.log(' getValues:', getValues())

      const validationResult = MemberRegistrationMergeSchema.safeParse(getValues())

      if (!validationResult.success) throw new Error('Error Parsing Form Data.')

      startTransition(async () => {
        const data = validationResult.data

        try {
          const response = memberDetails ? await updateMember({ id: memberDetails?.id, ...data }) : await registerMember(data)

          console.log('🚀 -> startTransition -> response:', response)

          if (typeof response === 'object' && response.status === 409) {
            form.setError('emailAdd', { message: response.message })
            toast.error(`Email "${form.getValues('emailAdd')}" is already exist.`, { position: 'top-center', duration: 5000 })
            setActiveStep(STEPS.GENERAL_INFO)
            return
          }

          toast.success(`Successfully ${memberDetails ? 'updated' : 'submitted'} your membership application.`, {
            position: 'top-center'
          })

          if (!isModalForm) {
            router.push('/')
          }

          if (isModalForm) {
            if (onClose) {
              onClose()
            }
          }

          // await new Promise((res) => setTimeout(() => res('sending...'), 1000))
        } catch (error) {
          console.error('ERROR: ', error)
          // setResponse({ success: false, message: 'Error sending inquiry! Please try again.' })
        }
      })
    }
  }

  // console.log('errors', { errors })

  return (
    <div
      className={cn(
        'relative mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16',
        showBanner && 'mt-36',
        className
      )}
    >
      {showFormHeader && (
        <div className='mx-auto flex max-w-6xl items-center justify-between gap-x-1.5 p-10 text-sm text-gray-600 decoration-2 hover:text-teal-500'>
          <div className='flex flex-col justify-center'>
            <h5 className='text-xl font-bold text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
              DSAP Membership Online Service
            </h5>
            <p className='text-sm font-normal text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-400'>
              Complete the form below to {memberDetails ? 'edit your membership application' : 'sign up for membership.'}
            </p>
          </div>
        </div>
      )}
      <div className={cn('mx-auto', isModalForm ? 'max-w-5xl p-0' : 'max-w-6xl p-5')}>
        <div className={cn('z-10 mx-4 bg-white', isModalForm ? 'sticky top-0 mx-0 h-[125px] w-full p-0 pt-1.5' : 'p-4')}>
          <div className={cn('flex items-center', isModalForm && 'mx-auto w-[90%]')}>
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
                        'flex items-center justify-center rounded-full border-2 border-gray-300 bg-transparent py-3 transition duration-500 ease-in-out',
                        activeStep === index && 'border-teal-600 bg-teal-600',
                        activeStep > index && 'border-teal-600',
                        isModalForm ? 'h-10 w-10' : 'h-12 w-12'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center text-gray-500',
                          activeStep === index && 'text-white',
                          activeStep > index && 'text-teal-600',
                          isModalForm ? 'h-8 w-8' : 'h-12 w-12'
                        )}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'text-wrap absolute top-0 -ml-10 mt-16 w-32 text-center text-xs font-medium uppercase text-teal-600',
                        activeStep < index && 'text-gray-500',
                        isModalForm && 'text-[11.5px]'
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
        <div className={cn(isModalForm ? 'mt-0 pt-0' : 'mt-8 p-4 ')}>
          <Form {...form}>
            <form className={cn('space-y-4', isModalForm ? 'mt-0' : 'mt-10 ')}>
              {getFormStepContent({ activeStep, setActiveStep, chapters, isModalForm })}
            </form>
          </Form>
          <div className={cn('flex items-center justify-end p-2', isModalForm ? 'mt-4' : 'mt-10 ')}>
            {activeStep > 0 &&
              (isModalForm ? (
                <Button
                  variant='secondary'
                  className={cn(activeStep === STEPS.GENERAL_INFO && 'cursor-not-allowed')}
                  disabled={activeStep === STEPS.GENERAL_INFO}
                  onClick={() => onBack()}
                >
                  Previous
                </Button>
              ) : (
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
              ))}

            {/* <div className='flex flex-auto flex-row-reverse'> */}
            <div className='flex'>
              {isModalForm ? (
                <Button className='ml-2' onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                  {activeStep !== STEPS.UPLOAD_PAYMENT && 'Next'}

                  {activeStep === STEPS.UPLOAD_PAYMENT &&
                    (isPending
                      ? memberDetails
                        ? 'Updating Application'
                        : 'Submitting Application'
                      : memberDetails
                      ? 'Update Application'
                      : 'Submit Application')}
                </Button>
              ) : (
                <button
                  className={cn(
                    'ml-2 flex min-w-[150px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                    isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                  )}
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                  // onClick={onNext}
                >
                  {activeStep !== STEPS.UPLOAD_PAYMENT && 'Next'}
                  {/* {activeStep === STEPS.REGISTRATION_DETAIL && 'Review Information'} */}
                  {activeStep === STEPS.UPLOAD_PAYMENT &&
                    (isPending
                      ? memberDetails
                        ? 'Updating Application'
                        : 'Submitting Application'
                      : memberDetails
                      ? 'Update Application'
                      : 'Submit Application')}
                </button>
              )}
            </div>
          </div>
        </div>

        <RHFDevTool control={form.control} />
      </div>
    </div>
  )
}
