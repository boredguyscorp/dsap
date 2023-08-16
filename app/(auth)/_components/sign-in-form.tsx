'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInResponse, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { LoginDto, loginSchema } from '@/lib/schema'
import { Icons } from '@/components/shared/icons'
import { getRedirectUrl } from '@/lib/redirect'
import url from '@/constants/url'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: 'test', password: '@Test123' }
  })

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleHubLoading] = React.useState<boolean>(false)
  // const searchParams = useSearchParams()

  const router = useRouter()
  const [signInRes, setSignInRes] = React.useState<SignInResponse | undefined>()

  React.useEffect(() => {
    console.log('🚀 useEffect -> SignInForm -> signInRes:', signInRes)
    if (signInRes?.ok) {
      router.push(url.app.overview)
    }
  }, [router, signInRes])

  async function onSubmit(data: LoginDto) {
    setIsLoading(true)

    const signInResult = await signIn('credentials', {
      ...data,
      redirect: false
      // callbackUrl: searchParams?.get('from') || '/dashboard'
    })
    // console.log('🚀 -> onSubmit -> signInResult v3:', signInResult)

    if (signInResult && signInResult.ok === false) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your sign in request failed. Please try again.',
        variant: 'destructive'
      })
    }

    // router.push(url.app.overview)
    setSignInRes(signInResult)
    setIsLoading(false)

    return toast({
      title: 'Login successful',
      description: 'Welcome to DSAP Portal.'
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Username
            </Label>
            <Input
              id='username'
              placeholder='Username'
              type='username'
              autoCapitalize='none'
              autoComplete='username'
              autoCorrect='off'
              disabled={isLoading || isGoogleLoading}
              {...register('username')}
            />
            {errors?.username && <p className='mt-1 px-1 text-xs text-red-600'>{errors.username.message}</p>}
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              placeholder='Password'
              type='password'
              autoCapitalize='none'
              autoComplete='password'
              autoCorrect='off'
              disabled={isLoading || isGoogleLoading}
              {...register('password')}
            />
            {errors?.password && <p className='mt-1 px-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>
          <button className={cn(buttonVariants(), '')} disabled={isLoading}>
            {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </button>
        </div>
      </form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div>
      <button
        type='button'
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsGoogleHubLoading(true)
          signIn('google')
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <Icons.google className='mr-2 h-4 w-4' />} Google
      </button>
    </div>
  )
}
