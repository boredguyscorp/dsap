'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/shared/icons'
import { MobileNav } from '@/components/mobile-nav'
import { Button, buttonVariants } from '@/components/ui/button'
import url from '@/constants/url'

import Logo from '@/components/logo'
import { signOut } from 'next-auth/react'
import { navItems, siteConfig } from '@/app/config'

interface MainNavProps {
  children?: React.ReactNode
  userId?: string | null | undefined
}

export function LandingNav({ children, userId }: MainNavProps) {
  const segment = useSelectedLayoutSegment()

  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const showRegistration = process.env.NEXT_PUBLIC_SHOW_REGISTRATION === 'true'

  return (
    <div className='flex h-20 items-center justify-between py-6 '>
      <Link href='/' className='flex items-center'>
        <Logo />
        <span className='flex flex-col'>
          <span className='text-sm font-bold tracking-[-0.03em] text-teal-600 sm:block md:text-lg'>{siteConfig.name}</span>
          <span className='text-xs font-normal tracking-[-0.03em] text-gray-900 sm:block md:text-sm'>{siteConfig.description}</span>
        </span>
      </Link>

      <div className='flex items-center space-x-4 sm:flex'>
        {navItems?.length ? (
          <nav className='hidden gap-6 xl:flex'>
            {navItems?.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-lg',
                  item.href.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}

        <nav className='hidden items-center space-x-2 xl:flex'>
          <Link
            href='/national-convention'
            className={cn(
              buttonVariants({
                variant: 'main',
                size: 'lg'
              }),
              'text-lg',
              'min-w-[200px]',
              'xl:ml-3',
              !showRegistration && 'hidden'
            )}
          >
            Register
          </Link>

          {/* <Link
            href='/membership'
            className={cn(
              buttonVariants({
                variant: 'main',
                size: 'lg'
              }),
              'text-lg',
              'min-w-[230px]',
              'xl:ml-3'
            )}
          >
            Become a Member
          </Link> */}
          {/* {userId ? (
            <div className='flex items-center space-x-2 '>
              <Link
                href='/dashboard'
                className={cn(
                  buttonVariants({
                    variant: 'outline'
                  })
                )}
              >
                Dashboard
              </Link>

              <Button
                variant='default'
                onClick={(event) => {
                  event.preventDefault()
                  signOut({
                    callbackUrl: `${window.location.origin}/`
                  })
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className='hidden space-x-2 lg:flex'>
              <Link
                href={url.app.signin}
                className={cn(
                  buttonVariants({
                    variant: 'main',
                    size: 'lg'
                  }),
                  'text-lg',
                  'min-w-[230px]',
                  'xl:ml-3'
                )}
              >
                Dashboard
              </Link>
              <Link
                href='/membership'
                className={cn(
                  buttonVariants({
                    variant: 'main',
                    size: 'lg'
                  }),
                  'text-lg',
                  'min-w-[230px]',
                  'xl:ml-3'
                )}
              >
                Become a Member
              </Link>
            </div>
          )} */}
        </nav>

        <button className='flex items-center space-x-2 xl:hidden' onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {/* <span className='font-bold'>Menu</span> */}
          {showMobileMenu ? <Icons.close /> : <Icons.menu />}
          {showMobileMenu && navItems && (
            <MobileNav items={navItems} userId={userId}>
              {children}
            </MobileNav>
          )}
        </button>
      </div>
    </div>
  )
}
