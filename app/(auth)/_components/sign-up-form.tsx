'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { SignUpDto, signUpSchema } from '@/lib/schema'
import { Icons } from '@/components/shared/icons'
import { createUser } from '@/actions/user'
import { useRouter } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema)
  })

  const [isGoogleLoading, setIsGoogleHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  const [isPosting, setIsPosting] = React.useTransition()
  const router = useRouter()

  // async function onSubmit2(data: SignUpDto) {
  //   setIsLoading(true)

  //   const signUpResult = await createUser(data)

  //   setIsLoading(false)

  //   if (!signUpResult) {
  //     return toast({
  //       title: 'Something went wrong.',
  //       description: 'Your sign up request failed. Please try again.',
  //       variant: 'destructive'
  //     })
  //   }

  //   // return toast({
  //   //   title: 'Login successful',
  //   //   description: 'Welcome to Portal.'
  //   // })
  // }

  function onSubmit(data: SignUpDto) {
    try {
      setIsPosting(async () => {
        const result = await createUser(data)

        if (result) {
          router.push('/sign-in')
        }

        // router.push(`/${props.organizationId}/${result.id}`)
        // window.location.assign(`/${props.organizationId}/${result.id}`)
      })
    } catch (error) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your sign up request failed. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='Email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isPosting || isGoogleLoading}
              {...register('email')}
            />
            {errors?.email && <p className='mt-1 px-1 text-xs text-red-600'>{errors.email.message}</p>}
          </div>
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
              disabled={isPosting || isGoogleLoading}
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
              disabled={isPosting || isGoogleLoading}
              {...register('password')}
            />
            {errors?.password && <p className='mt-1 px-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>
          <button className={cn(buttonVariants(), '')} disabled={isPosting}>
            {isPosting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
            Create Account
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
        disabled={isPosting || isGoogleLoading}
      >
        {isGoogleLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <Icons.google className='mr-2 h-4 w-4' />} Google
      </button>
    </div>
  )
}
