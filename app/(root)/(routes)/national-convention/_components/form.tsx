'use client'

import { Icons } from '@/components/shared/icons'
import { cn } from '@/lib/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

// import { InputFieldForm } from '../membership/_components/InputFieldForm'

import { useZodForm } from '@/lib/zod-form'
import { ConventionRegistrationForm, ConventionRegistrationFormSchema } from '@/lib/schema'
import { SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { Button } from '@/components/ui/button'

// import { DatePickerForm } from './_components/DatePickerForm'

const RHFDevTool = dynamic(() => import('../../../../../components/forms/DevTools'), { ssr: false })

import dsap25th from 'public/images/dsap25th.jpg'
// import logo from 'public/images/logo.jpg'

import Image from 'next/image'
import dynamic from 'next/dynamic'

import Balancer from 'react-wrap-balancer'
import { Label } from '@/components/ui/label'
import { CURRENT_CONVENTION, CURRENT_DATE, conventions, rateValues } from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
import { registerConvention } from '@/actions/convention'
import { toast } from 'react-hot-toast'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { useUploadThing } from '@/lib/uploadthing'
import { Form } from '@/components/ui/form'
import { RegistrationFormInputs } from './form-input'
import { ChapterList } from '@/actions/fetchers'

type NationalConventionFormProps = {
  chapters: ChapterList
}

export function NationalConventionForm({ chapters }: NationalConventionFormProps) {
  const [showForm, setShowForm] = useState(false)

  const convention = useMemo(() => conventions.find((row) => row.code === CURRENT_CONVENTION), [])
  const cutOffDate = convention?.preRegCutOff ?? '2024-02-16'
  const isPreReg = cutOffDate > CURRENT_DATE

  const defaultValues = {
    convention: CURRENT_CONVENTION,
    type: isPreReg ? '25th-prm' : '25th-m'
    // firstName: 'BG',
    // lastName: 'Dev',
    // contactNo: '+63 123 456 789',
    // emailAdd: 'bginside.dev@gmail.com'
    // proofOfPaymentUrl: 'https://uploadthing.com/'
  } as const

  const [isPending, startTransition] = useTransition()
  const [response, setResponse] = useState<{ success: boolean; message: string }>()
  const refSubmit = useRef<HTMLButtonElement>(null)

  const form = useZodForm({
    schema: ConventionRegistrationFormSchema,
    defaultValues,
    shouldUnregister: false
  })

  const {
    reset,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger
  } = form

  // console.log('🚀 -> NationalConventionPage -> errors:', errors)

  // UPLOADER
  const refUploaderBrowser = useRef<HTMLDivElement>(null)

  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
    setValue('proofOfPaymentUrl', 'uploaded')
    clearErrors('proofOfPaymentUrl')
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image'])
  })

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing('proofOfPaymentUploader', {
    onClientUploadComplete: (data) => {
      // setFiles([])
      if (!data) return

      startTransition(async () => {
        try {
          // refUpload.current?.click()

          console.log('🚀 -> startTransition -> getValues():', getValues())
          const { proofOfPaymentUrl, ...restOfFormData } = getValues()
          const paymentUrl = data[0].url

          const response = await registerConvention({ ...restOfFormData, proofOfPaymentUrl: paymentUrl })
          // console.log('🚀 -> startTransition -> response:', response)
          // await new Promise((res) => setTimeout(() => res('sending...'), 1000))
          setResponse({ success: true, message: 'Successfully submitted your registration.' })
          // setFiles([])
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
    },
    onUploadError: () => {
      toast.error('Sorry, an error occurred while uploading your image(s).')
      setResponse({ success: false, message: 'Error uploading proof of payment! Please try again.' })
    }
  })

  useEffect(() => {
    // console.log(errors.proofOfPaymentUrl)
    const errorKeys = Object.keys(errors)

    errorKeys.length == 1 &&
      errorKeys[0] === 'proofOfPaymentUrl' &&
      errors.proofOfPaymentUrl?.message?.toLocaleLowerCase().includes('required') &&
      refUploaderBrowser.current?.click()
  }, [errors.proofOfPaymentUrl])

  useEffect(() => {
    if (files.length > 0) {
      if (Number((files[0].size / 1024 ** 2).toPrecision(4)) > 2) {
        setError('proofOfPaymentUrl', { message: 'Image is too big. Max 2mb' })
      }
    }
  }, [files])

  if (!showForm) {
    return (
      <div className='mx-auto mt-32 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
        <div className='md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32'>
          <div>
            <Image src={dsap25th} alt='dsap-national-convention-25th' className='w-full rounded-xl object-cover' />
          </div>

          <div className='mt-5 sm:mt-10 lg:mt-0'>
            <div className='  space-y-6 sm:space-y-8'>
              <div className='space-y-2 md:space-y-4'>
                <p className='text-center text-lg'>
                  <Balancer>
                    Those who wish to join <span className='font-bold'>DSAP Convention 2024</span> shall submit registration together with
                    the corresponding fee and requirements.
                  </Balancer>
                </p>
              </div>

              <Separator />
              {/* <div className='flex flex-col items-center justify-center space-y-2 md:space-y-4'> */}
              <h2 className=' text-center text-2xl font-bold text-teal-600 dark:text-white md:text-3xl lg:text-4xl'>How to Register</h2>

              <ol className='max space-y-3 px-6 text-base font-semibold md:text-lg'>
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
              {/* </div> */}

              <Separator />
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
    )
  }

  const onSubmit: SubmitHandler<ConventionRegistrationForm> = async (data) => {
    // if (files.length == 0) {
    //   setError('proofOfPaymentUrl', { message: 'Proof of payment is required.' })
    //   refUploaderBrowser.current?.click()
    //   return
    // }

    // refUploadButton.current?.click()

    if (errors.proofOfPaymentUrl?.message?.includes('big')) {
      // console.log('zzzzzzzzz')
      setError('proofOfPaymentUrl', { message: 'Too big' })
      toast.error('Image is too big. Max (2MB)')
      return
    }

    startUpload(files)

    return
    // console.log('🚀 -> constonSubmit:SubmitHandler<ConventionRegistrationForm>= -> data:', data)
    startTransition(async () => {
      try {
        // refUpload.current?.click()

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
                    <RegistrationFormInputs chapters={chapters} />

                    <Separator className='mb-2 mt-6' />
                    <div className='space-y-2'>
                      <Label className={cn('font-medium', errors.proofOfPaymentUrl && 'text-red-500')}>
                        Proof of Payment {!watch('proofOfPaymentUrl') && errors.proofOfPaymentUrl && ' is required. '}
                        <span className={cn('text-lg font-bold text-teal-500', errors.proofOfPaymentUrl && 'text-red-500')}> * </span>
                      </Label>

                      {(files.length === 0 || errors.proofOfPaymentUrl?.message?.includes('big')) && (
                        <div
                          {...getRootProps()}
                          ref={refUploaderBrowser}
                          className='h-48 w-full cursor-pointer rounded-md border-2 border-dashed border-border'
                        >
                          <p
                            className={cn(
                              'relative top-[60px] flex flex-col items-center justify-center text-sm',
                              errors.proofOfPaymentUrl?.message?.includes('big') && 'top-[50px]'
                            )}
                          >
                            {errors.proofOfPaymentUrl?.message?.includes('big') && (
                              <span className='mb-2 text-base font-semibold text-red-500'>Image is too big. (Max 2MB)</span>
                            )}
                            <span className='mr-1 font-semibold text-teal-500'>Click to upload image</span>
                            <span>or drag and drop.</span>
                            <span className='text-xs text-muted-foreground'>(Max {permittedFileInfo?.config.image?.maxFileSize})</span>
                          </p>
                          <input
                            id='dataImages-images'
                            className='relative z-10 h-[100px] w-full border-2 opacity-0'
                            {...getInputProps()}
                            style={{ display: 'block' }}
                          />
                        </div>
                      )}

                      {files.length > 0 && (
                        <div className='mt-4'>
                          <li key={files[0].name} className='flex items-center'>
                            {files[0].name} - {(files[0].size / 1024 ** 2).toPrecision(4)} MB
                            {isPending || isUploading ? (
                              <span>
                                <Icons.spinner className='ml-2 h-6 w-6 animate-spin text-teal-500' />
                              </span>
                            ) : response?.success ? (
                              <Icons.check className='ml-2 h-6 w-6 text-teal-500' />
                            ) : (
                              <Button
                                type='button'
                                variant='link'
                                onClick={() => {
                                  setFiles([])
                                  setValue('proofOfPaymentUrl', '')
                                  clearErrors('proofOfPaymentUrl')
                                }}
                                className='text-red-500'
                              >
                                Remove
                              </Button>
                            )}
                          </li>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>

            {response && (
              <div
                className='mt-10 flex cursor-pointer justify-center text-center'
                onClick={() => {
                  response.success ? window.location.reload() : refSubmit.current?.click()
                }}
              >
                <div
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
                      Click here to create new.
                    </span>
                  )}
                </div>
              </div>
            )}

            {!response?.success && (
              <div className='mt-10 flex items-center p-2'>
                <div>
                  <p>Registration Fee:</p>
                  <Label className='text-xl font-semibold text-teal-600'>{rateValues.find((r) => r.value === watch('type'))?.label}</Label>
                </div>
                <div className='flex flex-auto flex-row-reverse'>
                  <button
                    ref={refSubmit}
                    className={cn(
                      'ml-2 flex h-16 min-w-[150px] cursor-pointer items-center justify-center rounded border border-teal-500 bg-teal-500 px-4 py-2 text-lg font-semibold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:bg-teal-400',
                      (isPending || isUploading) && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                    )}
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isPending || isUploading}
                  >
                    {isPending || isUploading ? 'Submitting Registration' : 'Submit Registration'}
                    {(isPending || isUploading) && <Icons.spinner className='ml-2 h-8 w-8 animate-spin' />}
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
