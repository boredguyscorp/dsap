'use client'

import * as React from 'react'
import Link from 'next/link'

import { MainNavItem } from '@/types'

import { cn } from '@/lib/utils'
import { useLockBody } from '@/hooks/use-lock-body'
import url from '@/constants/url'
import { buttonVariants } from './ui/button'

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  userId: string | null | undefined
}

export function MobileNav({ items, children, userId }: MobileNavProps) {
  const showRegistration = process.env.NEXT_PUBLIC_SHOW_REGISTRATION === 'true'

  useLockBody()

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 xl:hidden'
      )}
    >
      <div className='relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md'>
        <nav className='grid grid-flow-row auto-rows-max gap-3 text-sm'>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-xl font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              {item.title}
            </Link>
          ))}

          <Link
            href='/national-convention'
            className={cn(
              buttonVariants({
                variant: 'main',
                size: 'lg'
              }),
              'text-lg',
              'min-w-[230px]',
              'xl:ml-3',
              !showRegistration && 'hidden'
            )}
          >
            Register
          </Link>

          {/* {!userId && (
            <div className='flex space-x-2 lg:hidden'>
              <Link
                href={url.app.signin}
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    size: 'lg'
                  }),
                  'text-xl'
                )}
              >
                Sign in
              </Link>
              <Link
                href={url.app.signup}
                className={cn(
                  buttonVariants({
                    variant: 'main',
                    size: 'lg'
                  })
                )}
              >
                Sign up
              </Link>
            </div>
          )} */}
        </nav>
        {children}
      </div>
    </div>
  )
}
