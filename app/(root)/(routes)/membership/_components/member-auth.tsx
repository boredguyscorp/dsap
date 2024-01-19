import { authMember, resendOTP } from '@/actions/members'
import CountDown from '@/components/custom/countDown'
import { InputFieldForm } from '@/components/forms/InputFieldForm'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { MemberAuthFormSchema } from '@/lib/schema'
import { cn, isOTPValid } from '@/lib/utils'
import { useZodForm } from '@/lib/zod-form'
import { useRouter } from 'next/navigation'
import { authenticator, totp } from 'otplib'
import { useState, useTransition } from 'react'

type MemberAuthProps = {
  setShowForm: (show: boolean) => void
  setShowMemberAuthForm: (show: boolean) => void
}

export default function MemberAuth({ setShowForm, setShowMemberAuthForm }: MemberAuthProps) {
  const showBanner = process.env.NEXT_PUBLIC_SHOW_BANNER === 'true'

  const [isPending, startTransition] = useTransition()
  const [isMember, setIsMember] = useState(false)
  const [otpSecret, setOtpSecret] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [showResendButton, setShowResendButton] = useState(true)
  const [id, setId] = useState('')

  const router = useRouter()

  const toaster = useToast()

  const form = useZodForm({
    schema: MemberAuthFormSchema,
    defaultValues: { code: '' },
    shouldUnregister: false,
    mode: 'onChange'
  })

  const onSubmit = async (data: { code: string }, action: 'verify' | 'submit') => {
    try {
      startTransition(async () => {
        if (action === 'submit') {
          const _secret = authenticator.generateSecret()
          const __secret = _secret + '-' + process.env.NEXT_PUBLIC_OTP_SECRET_KEY

          console.log('submit __secret', __secret)

          if (_secret) setOtpSecret(_secret)

          const response = await authMember(data.code, __secret)

          if (!response.success) {
            form.setError('code', { message: 'Membership code does not exist.' })
            return
          }

          form.reset()
          setIsMember(true)
          setMemberEmail(response.email ?? 'N/A')
          setId(response.id ?? '')
          return
        }

        const __secret = otpSecret + '-' + process.env.NEXT_PUBLIC_OTP_SECRET_KEY

        const isValid = isOTPValid(data.code, __secret)

        if (isValid) {
          toaster.toast({
            title: 'Member Authentication',
            description: 'Membership successfully authenticated.'
          })

          setShowForm(true)
          setShowMemberAuthForm(false)
          setOtpSecret('')

          router.push(`/membership/${id}`)
        } else {
          form.setError('code', { message: 'Verification code is invalid.' })
        }
      })
    } catch (error) {
      toaster.toast({
        title: 'Error Membership Authentication',
        variant: 'destructive',
        description: 'An issue occurred while processing membership authentication. Please try again.'
      })
    }
  }

  const resend = async () => {
    try {
      setShowResendButton(false)

      const _secret = authenticator.generateSecret()
      const __secret = _secret + '-' + process.env.NEXT_PUBLIC_OTP_SECRET_KEY

      // console.log('resend __secret', __secret)

      if (_secret) setOtpSecret(_secret)

      startTransition(async () => {
        await resendOTP(__secret, memberEmail)
      })
    } catch (error) {
      toaster.toast({
        title: 'Resend OTP Failed',
        variant: 'destructive',
        description: 'An issue occurred while resending your OTP. Please try again.'
      })
    }
  }

  return (
    <div className={cn('mx-auto mb-20 ml-0 mt-24 min-h-screen max-w-full px-4 sm:px-6 lg:px-8 2xl:ml-16', showBanner && 'mt-36')}>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-x-1.5 p-10 text-sm text-gray-600 decoration-2'>
        <div className='mx-auto w-full p-5'>
          <Form {...form}>
            <Card className='mt-8 w-full'>
              <CardHeader className='flex-col items-center justify-center gap-4'>
                <Icons.lock className='h-8 w-8' />
                <div className='flex flex-col items-center justify-center gap-1.5'>
                  <CardTitle>Membership Authentication</CardTitle>
                  <CardDescription className='mb-5'>
                    Before we proceed, we need to ensure that you are a DSAP member. Please complete the form below to verify your DSAP
                    membership.
                  </CardDescription>

                  {isMember && (
                    <>
                      <CardDescription className='flex justify-center'>
                        <span className='text-center'>
                          A verification code has been sent to your email <span className='font-bold text-primary'>({memberEmail})</span>.
                        </span>
                      </CardDescription>
                      <CardDescription>
                        This code will be valid for <span className='font-bold text-primary'>1 hour</span>
                      </CardDescription>
                    </>
                  )}
                </div>
              </CardHeader>
              <Separator />

              <CardContent className='mt-5'>
                <div className='space-y-4'>
                  <InputFieldForm
                    control={form.control}
                    name='code'
                    fieldProps={{ placeholder: isMember ? 'Verification Code' : 'Membership Code', required: true }}
                    extendedProps={{ label: 'Code' }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className={cn('mt-10 flex items-center', isMember ? 'justify-between' : 'justify-end')}>
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

              <button
                className={cn(
                  'ml-2 flex min-w-[150px] cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:border-teal-500 enabled:hover:bg-teal-500',
                  isPending && 'cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700'
                )}
                onClick={form.handleSubmit((data) => onSubmit(data, isMember ? 'verify' : 'submit'))}
                disabled={isPending}
              >
                {isMember ? (isPending ? 'Verifying' : 'Verify') : isPending ? 'Submitting' : 'Submit'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
