'use client'

import * as React from 'react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { LoginDto, loginSchema } from '@/lib/schema'
import { Icons } from '@/components/shared/icons'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  signUp?: boolean
}

export function OAuthForm({ className, signUp, ...props }: UserAuthFormProps) {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<LoginDto>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: { username: 'test', password: '@Test123' }
  // })

  const [isGoogleLoading, setIsGoogleHubLoading] = React.useState<boolean>(false)

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
        </div>
      </div> */}
      <button
        type='button'
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsGoogleHubLoading(true)
          signIn('google')
        }}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <Icons.google className='mr-2 h-4 w-4' />}
        {signUp ? 'Sign up' : 'Sign in'} with Google
      </button>
    </div>
  )
}
