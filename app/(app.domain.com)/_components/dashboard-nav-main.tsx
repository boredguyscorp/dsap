import dynamic from 'next/dynamic'
import Link from 'next/link'

import Logo from '@/components/logo'

import { siteConfig } from '@/app/config'

import { NavList } from './nav-list'

import { UserAccountNav } from '@/components/user-account-nav'
import { getCurrentUser } from '@/lib/session'
import { Icons } from '@/components/shared/icons'
import urls from '@/constants/url'
import { Suspense } from 'react'

const ThemeToggle = dynamic(() => import('@/components/theme-toggle'), {
  ssr: false,
  loading: () => <div className='h-7 w-7 animate-pulse rounded-full bg-muted-foreground/70' />
})

const NavTabs = dynamic(() => import('./nav-tabs'), {
  ssr: false,
  loading: () => <div className='-mb-0.5 h-12 w-full' />
}) // dynamic import to avoid react hydration mismatch error

async function DashboardNavMain() {
  const user = getCurrentUser()

  return (
    <nav className='supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur'>
      <div className='mx-auto max-w-screen-2xl px-2.5 '>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href={urls.home} className='ml-[-2px] mr-2 flex max-w-3xl items-center'>
              <Logo size={70} />

              <span className='flex flex-col'>
                <span className='text-sm font-bold tracking-[-0.03em] text-teal-600 sm:block sm:text-lg'>{siteConfig.name}</span>
                <span className='text-xs font-normal tracking-[-0.03em] text-gray-900 sm:block sm:text-sm'>{siteConfig.description}</span>
              </span>
            </Link>
          </div>

          <div className='ml-auto flex items-center space-x-1 sm:space-x-2'>
            <NavList className='mx-6' />
            <Icons.bell />
            <ThemeToggle />
            <Suspense fallback={<Icons.spinner />}>
              <UserAccountNav userPromise={user} />
            </Suspense>
          </div>
        </div>
        <NavTabs />
      </div>
    </nav>
  )
}

export default DashboardNavMain
