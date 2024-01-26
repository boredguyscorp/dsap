import { authMember, resendOTP, sendOTPWithEmail } from '@/actions/members'
import CountDown from '@/components/custom/countDown'
import { InputFieldForm } from '@/components/forms/InputFieldForm'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { MemberAuthEmailFormSchema, MemberAuthFormSchema } from '@/lib/schema'
import { cn, isOTPValid } from '@/lib/utils'
import { useZodForm } from '@/lib/zod-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authenticator, totp } from 'otplib'
import { BaseSyntheticEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'

type MemberAuthProps = {
  setShowForm: (show: boolean) => void
  setShowMemberAuthForm: (show: boolean) => void
}

export default function MemberAuth({ setShowForm, setShowMemberAuthForm }: MemberAuthProps) {
  const showBanner = process.env.NEXT_PUBLIC_SHOW_BANNER === 'true'

  const [isPending, startTransition] = useTransition()
  const [isSendingOTPToEmail, setIsSendingOTPtoEmail] = useTransition()

  const [showEmailField, setShowEmailField] = useState(false)
  const [showNoEmail, setShowNoEmail] = useState(false)
  const [isForbidden, setIsForbidden] = useState(false)

  const [isMember, setIsMember] = useState(false)
  const [otpSecret, setOtpSecret] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [showResendButton, setShowResendButton] = useState(true)
  const [id, setId] = useState('')

  const router = useRouter()

  const form = useZodForm({
    schema: MemberAuthFormSchema,
    defaultValues: { code: '' },
    shouldUnregister: false,
    mode: 'onChange'
  })

  const EmailForm = useZodForm({
    schema: MemberAuthEmailFormSchema,
    defaultValues: { email: '' },
    shouldUnregister: false,
    mode: 'onChange'
  })

  const onSubmit = async (data: { code: string }, action: 'verify' | 'submit') => {
    startTransition(async () => {
      try {
        if (action === 'submit') {
          const _secret = authenticator.generateSecret()

          if (_secret) setOtpSecret(_secret)

          const response = await authMember(data.code, _secret)

          if (response.status === 404) {
            form.setError('code', { message: response.message })
            return
          }

          if (response.status === 403) {
            toast.error(response.message, { position: 'top-center' })
            setIsForbidden(true)
            return
          }

          if (response.status === 401) {
            toast.error(response.message, { position: 'top-center' })
            // setShowEmailField(true)
            setShowNoEmail(true)
            return
          }

          form.reset()
          setIsMember(true)
          setMemberEmail(response.email ?? 'N/A')
          setId(response.id ?? '')
          return
        }

        const isValid = isOTPValid(data.code, otpSecret)

        if (isValid) {
          toast.success(`Membership successfully authenticated`, { position: 'top-center' })

          setShowForm(true)
          setShowMemberAuthForm(false)
          setOtpSecret('')

          router.push(`/membership/${id}`)
        } else {
          form.setError('code', { message: 'Verification code is invalid.' })
        }
      } catch (error) {
        console.error(error)
        form.setError('code', { message: 'Error occured! Please try again.' })
      }
    })
  }

  const onSendSubmit = async (data: { email: string }, e: BaseSyntheticEvent<object, any, any> | undefined) => {
    setIsSendingOTPtoEmail(async () => {
      try {
        e?.preventDefault()

        const _secret = authenticator.generateSecret()

        if (_secret) setOtpSecret(_secret)

        const response = await sendOTPWithEmail(form.getValues('code'), _secret, data.email)

        if (response?.status === 409) {
          EmailForm.setError('email', { message: response.message })
          return
        }

        if (!response.success) {
          toast.error('Failed to send OTP')
          return
        }

        form.reset()
        EmailForm.reset()
        setIsMember(true)
        setShowEmailField(false)
        setMemberEmail(response.email ?? 'N/A')
        setId(response.id ?? '')
      } catch (error) {
        console.error(error)
        toast.error(`Error occured while sending OTP to ${data.email}! Please try again.`)
      }
    })
  }

  const resend = async () => {
    setShowResendButton(false)

    const _secret = authenticator.generateSecret()

    if (_secret) setOtpSecret(_secret)

    startTransition(async () => {
      try {
        await resendOTP(_secret, memberEmail)
      } catch (error) {
        console.error(error)
        form.setError('code', { message: 'Error occured while sending OTP! Please try again.' })
      }
    })
  }

  return (
    <div className={cn('mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16', showBanner && 'mt-36')}>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-x-1.5 p-10 text-sm text-gray-600 decoration-2'>
        <div className='mx-auto p-5 sm:w-full md:w-[640px]'>
          <Form {...form}>
            <Card className='mt-8'>
              <CardHeader className='flex-col items-center justify-center gap-4'>
                <Icons.lock className='h-8 w-8' />
                <div className='flex flex-col items-center justify-center gap-1.5'>
                  <CardTitle>Membership Authentication</CardTitle>

                  {!showNoEmail && !isForbidden && (
                    <CardDescription className='mb-5 text-center'>
                      Before we proceed, we need to ensure that you are a DSAP member. Please complete the form below to verify your DSAP
                      membership.
                    </CardDescription>
                  )}

                  {isMember && (
                    <>
                      <CardDescription className='text-center'>A verification code has been sent to your email:</CardDescription>
                      <CardDescription className='text-center text-[17px] font-bold text-primary'>{memberEmail}</CardDescription>
                      <CardDescription className='text-center'>
                        This code will be valid for <span className='font-bold text-primary'>1 hour.</span>
                      </CardDescription>
                    </>
                  )}

                  {/* {showEmailField && (
                    <span className='text-center text-xs text-gray-400'>
                      Note: The email you entered must be unique and will be automatically saved as your membership email address.
                    </span>
                  )} */}
                </div>
              </CardHeader>
              <Separator />

              {!showNoEmail && !isForbidden ? (
                <>
                  <CardContent className='mt-5 pb-2.5'>
                    <div className='mx-auto w-[240px] space-y-4'>
                      <InputFieldForm
                        control={form.control}
                        name='code'
                        fieldProps={{
                          placeholder: isMember ? '6 Digit Code' : '9 Character Code',
                          className: '!text-center'
                        }}
                        extendedProps={{
                          label: isMember ? 'Verification Code' : 'Membership Code',
                          labelClassName: 'block w-full text-center',
                          errorMessageClassName: 'text-center'
                        }}
                      />
                    </div>
                  </CardContent>

                  <CardContent>
                    <button
                      className={cn(
                        'mx-auto flex w-[240px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                        isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                      )}
                      onClick={form.handleSubmit((data) => onSubmit(data, isMember ? 'verify' : 'submit'))}
                      disabled={isPending}
                    >
                      {isMember ? (isPending ? 'Verifying' : 'Verify') : isPending ? 'Submitting' : 'Submit'}
                    </button>
                  </CardContent>
                </>
              ) : (
                <>
                  {/* <Form {...EmailForm}>
                    <CardContent className='mt-5 pb-2.5'>
                      <div className='gap1 mx-auto flex w-[240px] flex-col space-y-4'>
                        <InputFieldForm
                          control={EmailForm.control}
                          name='email'
                          fieldProps={{ placeholder: 'Email', className: '!text-center' }}
                          extendedProps={{
                            label: 'Email Address',
                            labelClassName: 'block w-full text-center',
                            errorMessageClassName: 'text-center'
                          }}
                        />
                      </div>
                    </CardContent>

                    <CardContent>
                      <button
                        className={cn(
                          'mx-auto flex w-[240px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                          isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                        )}
                        onClick={EmailForm.handleSubmit((data, e) => onSendSubmit(data, e))}
                        disabled={isSendingOTPToEmail}
                      >
                        {isSendingOTPToEmail ? 'Submitting' : 'Submit'}
                      </button>
                    </CardContent>
                  </Form> */}

                  <CardContent className='space-y-2 p-5 text-sm'>
                    <p className='text-center'>
                      {showNoEmail && (
                        <>
                          Oops! It seems that <span className='font-bold'>we couldn't locate an email associated with your membership</span>
                          .{' '}
                        </>
                      )}
                      {isForbidden && (
                        <>
                          Oops! Sorry, you can't proceed with updating your membership because your membership status is still "
                          <span className='font-bold'>Pending</span>."{' '}
                        </>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className='text-center text-xs text-muted-foreground'>
                      If you believe this is an error or have any questions, please feel free to reach out{' '}
                      <Link className='text-teal-600' href='/contact-us'>
                        here
                      </Link>{' '}
                      to the <span className='font-bold'>DSAP Office</span> for assistance. We're here to help and provide the information
                      you need to proceed with updating your membership. Thank you!
                    </p>
                  </CardFooter>
                </>
              )}
            </Card>

            <div className='mt-10 flex items-center'>
              {isMember && (
                <div className='flex flex-col gap-1.5'>
                  <div>It may take a minute to receive your code.</div>
                  <div className='flex flex-col items-start gap-1.5 sm:flex-row'>
                    <span>Haven't received it?</span>
                    {showResendButton && (
                      <Button variant='link' className='h-fit p-0 font-semibold text-teal-600' onClick={() => resend()}>
                        Resend a new code
                      </Button>
                    )}

                    {!showResendButton && (
                      <span className='flex gap-1'>
                        <span> You can resend a code again in</span>
                        <CountDown className='font-semibold text-teal-600' seconds={120} callback={() => setShowResendButton(true)} />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
