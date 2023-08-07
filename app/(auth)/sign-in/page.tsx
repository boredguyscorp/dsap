import { Metadata } from 'next'
import Link from 'next/link'

import Logo from '@/components/logo'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import url from '@/constants/url'
import { OAuthForm } from '../_components/oauth-form'

// export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your portal account'
}

export default function LoginPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <>
        <Link href='/' className={cn(buttonVariants({ variant: 'ghost' }), 'absolute left-4 top-3 md:left-8 md:top-8')}>
          <>
            <Icons.chevronLeft className='mr-2 h-4 w-4' />
            Back
          </>
        </Link>
        <Link href={url.app.signup} className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-3 md:right-8 md:top-8')}>
          <>
            Sign up
            <Icons.chevronRight className='ml-2 h-4 w-4' />
          </>
        </Link>
      </>

      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <span className='mb-5'>
            <Logo />
          </span>
          {/* <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
          <p className='text-sm text-muted-foreground'>Enter your credentials to sign in to your account</p> */}
        </div>

        {/* <SignInForm /> */}
        <OAuthForm />

        <p className='px-8 text-center text-sm text-muted-foreground'>
          <Link href={url.app.signup} className='hover:text-brand underline underline-offset-4'>
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
