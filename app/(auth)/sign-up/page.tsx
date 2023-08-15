import { Metadata } from 'next'
import Link from 'next/link'

import Logo from '@/components/logo'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import { SignUpForm } from '../_components/sign-up-form'
import url from '@/constants/url'
// import { OAuthForm } from '../_components/oauth-form'

export const metadata: Metadata = {
  title: 'Sign-up',
  description: 'Create your portal account'
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
        <Link href={url.app.signin} className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-3 md:right-8 md:top-8')}>
          <>
            Sign in
            <Icons.chevronRight className='ml-2 h-4 w-4' />
          </>
        </Link>
      </>

      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <span className='mb-5'>
            <Logo />
          </span>
          {/* <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
          <p className='text-sm text-muted-foreground'>Enter your credentials below to create your account.</p> */}
        </div>

        <SignUpForm />
        {/* <OAuthForm signUp /> */}

        <p className='px-8 text-center text-sm text-muted-foreground'>
          By signing up, you agree to our <br />
          <Link href='/terms' className='hover:text-brand underline underline-offset-4'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='hover:text-brand underline underline-offset-4'>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
