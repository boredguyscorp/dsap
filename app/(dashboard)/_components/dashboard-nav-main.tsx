import { Suspense } from 'react'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import Logo from '@/components/logo'

import { siteConfig } from '@/app/config'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher } from './organization-switcher'
import { BusinessSwitcher } from './business-switcher'
import { NavList } from './nav-list'
import { cookies } from 'next/headers'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { notFound, redirect } from 'next/navigation'
import { UserAccountNav } from '@/components/user-account-nav'
import { getCurrentUser } from '@/lib/session'

const ThemeToggle = dynamic(() => import('@/components/theme-toggle'), {
  ssr: false,
  loading: () => <div className='h-7 w-7 animate-pulse rounded-full bg-muted-foreground/70' />
})

const NavTabs = dynamic(() => import('./nav-tabs'), {
  ssr: false,
  loading: () => <div className='-mb-0.5 h-12 w-full' />
}) // dynamic import to avoid react hydration mismatch error

// async function getOrgData() {
//   const res = await fetch('http://localhost:3000/api/organization')

//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }

//   // // console.log('🚀 -> getOrgData -> res:', res)
//   // return res.json()
// }

async function getOrgData(): Promise<any> {
  // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
  // if (!userId) return undefined

  // TODO: TEMPORARY... IT SHOULD BE IN THE ROUTE HANDLER
  const requestHeaders = new Headers()
  requestHeaders.append('x-user', 'userId_XXX')

  const res = await fetch('http://localhost:3000/api/organization', {
    method: 'GET',
    headers: requestHeaders
  })

  return res.json()
}

interface DashboardMainNavProps {
  organizationData: Record<string, any>[]
}

async function DashboardNavMain({ organizationData }: DashboardMainNavProps) {
  // const organizationData = await getOrgData()

  // const cookieStore = cookies()
  // const orgId = cookieStore.get('organizationId')
  // console.log('🚀 -> OrganizationPage -> cookieStore:', cookieStore.getAll())
  // console.log('🚀 -> OrganizationPage -> orgId:', orgId)

  // console.log('DashboardMainNav', cookies().getAll())

  // --> this is from lib/actions
  // const organizationData = await getOrganizationData()

  // const userId = 'user_2SgeDC78m9sqxvngEheKj7hBaWD'
  // if (!userId) redirect('/sign-in')

  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const hasRecord = organizationData && organizationData.length > 0

  return (
    <nav className='supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur'>
      <div className='mx-auto max-w-screen-2xl px-2.5 '>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='ml-[-2px] mr-2 flex max-w-[180px]'>
              <Logo />
            </Link>

            <OrganizationSwitcher organizationData={organizationData} userId={user.id} />

            <Suspense>
              <BusinessSwitcher organizationData={organizationData} />
            </Suspense>
          </div>

          <div className='ml-auto flex items-center space-x-1 sm:space-x-2'>
            {hasRecord && <NavList className='mx-6' />}
            <ThemeToggle />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email
              }}
            />
          </div>
        </div>
        {hasRecord && <NavTabs organizationData={organizationData} />}
      </div>
    </nav>
  )
}

export default DashboardNavMain
