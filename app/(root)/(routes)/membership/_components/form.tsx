'use client'

import { Icons } from '@/components/shared/icons'
import { cn, convertStringDatesPropToDates, getFileFromBlobUrl } from '@/lib/utils'
import React, { useMemo, useState, useTransition } from 'react'

import { Form } from '@/components/ui/form'

import { useZodForm } from '@/lib/zod-form'
import {
  MemberGeneralInfo,
  MemberRegistrationForm,
  MemberRegistrationFormSchema,
  MemberRegistrationMergeSchema,
  _MemberRegistrationFormSchema,
  _MemberRegistrationMergeSchema,
  _uploadPayment,
  uploadPayment
} from '@/lib/schema'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import _ from 'lodash'

const RHFDevTool = dynamic(() => import('../../../../../components/forms/DevTools'), { ssr: false })

import dynamic from 'next/dynamic'

import { MemberEntity, isMemberEmailExist, registerMember, updateMember } from '@/actions/members'

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
  strict?: boolean
}

export default function MembershipForm({
  chapters,
  memberDetails,
  showFormDefaultValue,
  className,
  showFormHeader = true,
  isModalForm = false,
  onClose,
  strict = true
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
  const [activeStep, setActiveStep] = useState(/*STEPS.GENERAL_INFO*/ 0)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const currentValidationSchema = activeStep > 4 ? uploadPayment : MemberRegistrationFormSchema[activeStep < 4 ? activeStep : 0]

  const _currentValidationSchema = activeStep > 4 ? _uploadPayment : _MemberRegistrationFormSchema[activeStep < 4 ? activeStep : 0]

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
    schema: strict ? currentValidationSchema : _currentValidationSchema,
    defaultValues: memberDetails ? memberDetails : defaultValues,
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

  const onSubmit = async (data: FieldValues, isForceSubmit?: boolean) => {
    let isEmailExist = false

    if (activeStep !== STEPS.UPLOAD_PAYMENT) {
      if (activeStep === STEPS.GENERAL_INFO) {
        if (data.emailAdd) {
          setIsCheckingEmail(true)

          isEmailExist = memberDetails
            ? await isMemberEmailExist({ action: 'edit', code: memberDetails.code, email: data.emailAdd })
            : await isMemberEmailExist({ action: 'create', email: data.emailAdd })

          setIsCheckingEmail(false)

          if (isEmailExist) {
            form.setError('emailAdd', { message: 'Email already exist' })
            toast.error(`Email "${form.getValues('emailAdd')}" is already exist.`, { position: 'top-center', duration: 5000 })
            return
          }
        }
      }

      if (!isForceSubmit) {
        return onNext()
      }
    }

    if (isForceSubmit || activeStep === STEPS.UPLOAD_PAYMENT) {
      const validationResult =
        !strict && memberDetails
          ? _MemberRegistrationMergeSchema.safeParse(getValues())
          : MemberRegistrationMergeSchema.safeParse(getValues())

      if (!validationResult.success) throw new Error('Error Parsing Form Data.')

      startTransition(async () => {
        const data = validationResult.data as any

        try {
          const formData = new FormData()
          let response: Awaited<ReturnType<typeof updateMember>> | Awaited<ReturnType<typeof registerMember>>

          if (memberDetails) {
            //? populate formData / process file by getting the file based on the BLOB URL
            //? drug store profile - dpDSClassDetails formData, drugstoreClass = single
            if (
              data &&
              data.drugstoreClass &&
              data.drugstoreClass === 'single' &&
              data.dpDSClassDetails &&
              !_.isEmpty(data.dpDSClassDetails)
            ) {
              const dpDSClassDetails = data.dpDSClassDetails
              const dpPhImageUrl = dpDSClassDetails.dpPhImageUrl?.startsWith('blob:')
                ? getFileFromBlobUrl(dpDSClassDetails.dpPhImageUrl)
                : null

              const dpPhAsImageUrl = dpDSClassDetails.dpPhAsImageUrl?.startsWith('blob:')
                ? getFileFromBlobUrl(dpDSClassDetails.dpPhAsImageUrl)
                : null
              const dpPhAsAttachmentCOEUrl = dpDSClassDetails.dpPhAsAttachmentCOEUrl?.startsWith('blob:')
                ? getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentCOEUrl)
                : null
              const dpPhAsAttachmentDiplomaUrl = dpDSClassDetails.dpPhAsAttachmentDiplomaUrl?.startsWith('blob:')
                ? getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentDiplomaUrl)
                : null
              const dpPhAsAttachmentCOAUrl = dpDSClassDetails.dpPhAsAttachmentCOAUrl?.startsWith('blob:')
                ? getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentCOAUrl)
                : null

              const [
                dpPhImageUrlFile,
                dpPhAsImageUrlFile,
                dpPhAsAttachmentCOEUrlFile,
                dpPhAsAttachmentDiplomaUrlFile,
                dpPhAsAttachmentCOAUrlFile
              ] = await Promise.all([
                dpPhImageUrl,
                dpPhAsImageUrl,
                dpPhAsAttachmentCOEUrl,
                dpPhAsAttachmentDiplomaUrl,
                dpPhAsAttachmentCOAUrl
              ])

              const dpDSClassDetailsObj = {
                dpPhImageUrl: dpPhImageUrlFile,
                dpPhAsImageUrl: dpPhAsImageUrlFile,
                dpPhAsAttachmentCOEUrl: dpPhAsAttachmentCOEUrlFile,
                dpPhAsAttachmentDiplomaUrl: dpPhAsAttachmentDiplomaUrlFile,
                dpPhAsAttachmentCOAUrl: dpPhAsAttachmentCOAUrlFile
              }

              for (const key in dpDSClassDetailsObj) {
                if (dpDSClassDetailsObj[key as keyof typeof dpDSClassDetailsObj] instanceof File) {
                  const file = dpDSClassDetailsObj[key as keyof typeof dpDSClassDetailsObj] as File
                  formData.append(key, file)
                } else continue
              }
            }

            //? drug store profile - dpDSClassDetails formData, drugstoreClass = chain
            if (
              data &&
              data.drugstoreClass &&
              data.drugstoreClass === 'chain' &&
              data.dpDSClassDetails &&
              !_.isEmpty(data.dpDSClassDetails)
            ) {
              const dpDSClassDetails = data.dpDSClassDetails
              const dpBranches = dpDSClassDetails.dpBranches

              if (dpBranches && dpBranches.length > 0) {
                const branchesObj = []
                let index = -1

                for (const branches of dpBranches) {
                  ++index
                  const fdaUrlAttachment = branches.fdaUrlAttachment ? getFileFromBlobUrl(branches.fdaUrlAttachment) : null
                  const docUrlAttachment = branches.docUrlAttachment ? getFileFromBlobUrl(branches.docUrlAttachment) : null

                  const [fdaUrlAttachmentFile, docUrlAttachmentFile] = await Promise.all([fdaUrlAttachment, docUrlAttachment])

                  branchesObj.push({
                    key: `dpbranch-${index}`,
                    fdaUrlAttachment: fdaUrlAttachmentFile,
                    docUrlAttachment: docUrlAttachmentFile
                  })
                }

                branchesObj.forEach((b) => {
                  if (b.fdaUrlAttachment) formData.append(`${b.key}-fdaUrlAttachment`, b.fdaUrlAttachment)
                  if (b.docUrlAttachment) formData.append(`${b.key}-docUrlAttachment`, b.docUrlAttachment)
                })
              }
            }

            //? Owner profile
            if (data && data.opPhImageUrl && data.opPhImageUrl?.startsWith('blob:')) {
              const opPhImageUrlFile = await getFileFromBlobUrl(data.opPhImageUrl)
              formData.append('opPhImageUrl', opPhImageUrlFile)
            }

            //? Owner profile - opDsapMemberType = representative
            if (
              data &&
              data.opDsapMember &&
              data.opDsapMember.opDsapMemberType &&
              data.opDsapMember.opDsapMemberType === 'representative'
            ) {
              const opDsapMember = data.opDsapMember
              const opRepFormUrl = opDsapMember.opRepFormUrl?.startsWith('blob:') ? getFileFromBlobUrl(opDsapMember.opRepFormUrl) : null
              const opRepPhotoUrl = opDsapMember.opRepPhotoUrl?.startsWith('blob:') ? getFileFromBlobUrl(opDsapMember.opRepPhotoUrl) : null

              const [opRepFormUrlFile, opRepPhotoUrlFile] = await Promise.all([opRepFormUrl, opRepPhotoUrl])

              const opDsapMemberObj = {
                opRepFormUrl: opRepFormUrlFile,
                opRepPhotoUrl: opRepPhotoUrlFile
              }

              for (const key in opDsapMemberObj) {
                if (opDsapMemberObj[key as keyof typeof opDsapMemberObj] instanceof File) {
                  const file = opDsapMemberObj[key as keyof typeof opDsapMemberObj] as File
                  formData.append(key, file)
                } else continue
              }
            }

            //? Registration details
            if (data.fdaUrlAttachment && data.fdaUrlAttachment?.startsWith('blob:')) {
              const fdaUrlAttachmentFile = await getFileFromBlobUrl(data.fdaUrlAttachment)
              formData.append('fdaUrlAttachment', fdaUrlAttachmentFile)
            }

            if (data.bpUrlAttachment && data.bpUrlAttachment?.startsWith('blob:')) {
              const bpUrlAttachment = await getFileFromBlobUrl(data.bpUrlAttachment)
              formData.append('bpUrlAttachment', bpUrlAttachment)
            }

            if (data.docUrlAttachment && data.docUrlAttachment?.startsWith('blob:')) {
              const docUrlAttachment = await getFileFromBlobUrl(data.docUrlAttachment)
              formData.append('docUrlAttachment', docUrlAttachment)
            }

            if (data.proofOfPaymentUrl && data.proofOfPaymentUrl?.startsWith('blob:')) {
              const proofOfPaymentUrl = await getFileFromBlobUrl(data.proofOfPaymentUrl)
              formData.append('proofOfPaymentUrl', proofOfPaymentUrl)
            }

            response = await updateMember({ id: memberDetails?.id, ...data }, formData)
          } else {
            //? populate formData / process file by getting the file based on the BLOB URL
            //? drug store profile - dpDSClassDetails formData, drugstoreClass = single
            if (
              data &&
              data.drugstoreClass &&
              data.drugstoreClass === 'single' &&
              data.dpDSClassDetails &&
              !_.isEmpty(data.dpDSClassDetails)
            ) {
              const dpDSClassDetails = data.dpDSClassDetails
              const dpPhImageUrl = getFileFromBlobUrl(dpDSClassDetails.dpPhImageUrl)

              const dpPhAsImageUrl = getFileFromBlobUrl(dpDSClassDetails.dpPhAsImageUrl)
              const dpPhAsAttachmentCOEUrl = getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentCOEUrl)
              const dpPhAsAttachmentDiplomaUrl = getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentDiplomaUrl)
              const dpPhAsAttachmentCOAUrl = getFileFromBlobUrl(dpDSClassDetails.dpPhAsAttachmentCOAUrl)

              const [
                dpPhImageUrlFile,
                dpPhAsImageUrlFile,
                dpPhAsAttachmentCOEUrlFile,
                dpPhAsAttachmentDiplomaUrlFile,
                dpPhAsAttachmentCOAUrlFile
              ] = await Promise.all([
                dpPhImageUrl,
                dpPhAsImageUrl,
                dpPhAsAttachmentCOEUrl,
                dpPhAsAttachmentDiplomaUrl,
                dpPhAsAttachmentCOAUrl
              ])

              const dpDSClassDetailsObj = {
                dpPhImageUrl: dpPhImageUrlFile,
                dpPhAsImageUrl: dpPhAsImageUrlFile,
                dpPhAsAttachmentCOEUrl: dpPhAsAttachmentCOEUrlFile,
                dpPhAsAttachmentDiplomaUrl: dpPhAsAttachmentDiplomaUrlFile,
                dpPhAsAttachmentCOAUrl: dpPhAsAttachmentCOAUrlFile
              }

              for (const key in dpDSClassDetailsObj) {
                formData.append(key, dpDSClassDetailsObj[key as keyof typeof dpDSClassDetailsObj])
              }
            }

            //? drug store profile - dpDSClassDetails formData, drugstoreClass = chain
            if (
              data &&
              data.drugstoreClass &&
              data.drugstoreClass === 'chain' &&
              data.dpDSClassDetails &&
              !_.isEmpty(data.dpDSClassDetails)
            ) {
              const dpDSClassDetails = data.dpDSClassDetails
              const dpBranches = dpDSClassDetails.dpBranches

              if (dpBranches && dpBranches.length > 0) {
                const branchesObj = []
                let index = -1

                for (const branches of dpBranches) {
                  ++index
                  const fdaUrlAttachment = branches.fdaUrlAttachment ? getFileFromBlobUrl(branches.fdaUrlAttachment) : null
                  const docUrlAttachment = branches.docUrlAttachment ? getFileFromBlobUrl(branches.docUrlAttachment) : null

                  const [fdaUrlAttachmentFile, docUrlAttachmentFile] = await Promise.all([fdaUrlAttachment, docUrlAttachment])

                  branchesObj.push({
                    key: `dpbranch-${index}`,
                    fdaUrlAttachment: fdaUrlAttachmentFile,
                    docUrlAttachment: docUrlAttachmentFile
                  })
                }

                branchesObj.forEach((b) => {
                  if (b.fdaUrlAttachment) formData.append(`${b.key}-fdaUrlAttachment`, b.fdaUrlAttachment)
                  if (b.docUrlAttachment) formData.append(`${b.key}-docUrlAttachment`, b.docUrlAttachment)
                })
              }
            }

            //? Owner profile
            if (data && data.opPhImageUrl) {
              const opPhImageUrlFile = await getFileFromBlobUrl(data.opPhImageUrl)
              formData.append('opPhImageUrl', opPhImageUrlFile)
            }

            //? Owner profile - opDsapMemberType = representative
            if (
              data &&
              data.opDsapMember &&
              data.opDsapMember.opDsapMemberType &&
              data.opDsapMember.opDsapMemberType === 'representative'
            ) {
              const opDsapMember = data.opDsapMember
              const opRepFormUrl = getFileFromBlobUrl(opDsapMember.opRepFormUrl)
              const opRepPhotoUrl = getFileFromBlobUrl(opDsapMember.opRepPhotoUrl)

              const [opRepFormUrlFile, opRepPhotoUrlFile] = await Promise.all([opRepFormUrl, opRepPhotoUrl])

              const opDsapMemberObj = {
                opRepFormUrl: opRepFormUrlFile,
                opRepPhotoUrl: opRepPhotoUrlFile
              }

              for (const key in opDsapMemberObj) {
                formData.append(key, opDsapMemberObj[key as keyof typeof opDsapMemberObj])
              }
            }

            //? Registration details
            if (data.fdaUrlAttachment) {
              const fdaUrlAttachmentFile = await getFileFromBlobUrl(data.fdaUrlAttachment)
              formData.append('fdaUrlAttachment', fdaUrlAttachmentFile)
            }

            if (data.bpUrlAttachment) {
              const bpUrlAttachment = await getFileFromBlobUrl(data.bpUrlAttachment)
              formData.append('bpUrlAttachment', bpUrlAttachment)
            }

            if (data.docUrlAttachment) {
              const docUrlAttachment = await getFileFromBlobUrl(data.docUrlAttachment)
              formData.append('docUrlAttachment', docUrlAttachment)
            }

            if (data.proofOfPaymentUrl) {
              const proofOfPaymentUrl = await getFileFromBlobUrl(data.proofOfPaymentUrl)
              formData.append('proofOfPaymentUrl', proofOfPaymentUrl)
            }

            response = await registerMember(data, formData)
          }

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
            router.push(`/success/membership-application-${memberDetails ? 'updated' : 'submitted'}`)
          }

          if (isModalForm) {
            if (onClose) {
              onClose()
            }
          }
        } catch (error) {
          console.error('ERROR: ', error)
        }
      })
    }
  }

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
                        'absolute top-0 -ml-10 mt-16 w-32 text-wrap text-center text-xs font-medium uppercase text-teal-600',
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
          <div
            className={cn(
              'flex items-center py-2',
              isModalForm ? 'mt-4' : 'mt-10 ',
              !strict && memberDetails && activeStep !== STEPS.UPLOAD_PAYMENT ? 'justify-between' : 'justify-end'
            )}
          >
            {!strict && memberDetails && activeStep !== STEPS.UPLOAD_PAYMENT && (
              <div>
                {isModalForm ? (
                  <Button onClick={form.handleSubmit((data) => onSubmit(data, true))} disabled={isPending}>
                    {isPending
                      ? memberDetails
                        ? 'Updating Application'
                        : 'Submitting Application'
                      : memberDetails
                        ? 'Update Application'
                        : 'Submit Application'}
                  </Button>
                ) : (
                  <button
                    className={cn(
                      'ml-2 flex min-w-[150px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                      (isPending || isCheckingEmail) && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                    )}
                    onClick={form.handleSubmit((data) => onSubmit(data, true))}
                    disabled={isPending || isCheckingEmail}
                    // onClick={onNext}
                  >
                    {isPending
                      ? memberDetails
                        ? 'Updating Application'
                        : 'Submitting Application'
                      : memberDetails
                        ? 'Update Application'
                        : 'Submit Application'}
                  </button>
                )}
              </div>
            )}
            <div className='flex'>
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

              {/* <div className='flex flex-row-reverse flex-auto'> */}
              <div className='flex'>
                {isModalForm ? (
                  <Button className='ml-2' onClick={form.handleSubmit((data) => onSubmit(data))} disabled={isPending}>
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
                      (isPending || isCheckingEmail) && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                    )}
                    onClick={form.handleSubmit((data) => onSubmit(data))}
                    disabled={isPending || isCheckingEmail}
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
        </div>

        <RHFDevTool control={form.control} />
      </div>
    </div>
  )
}
