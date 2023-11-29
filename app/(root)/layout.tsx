import SiteFooter from '@/components/footer'

// import { LandingNav } from './_components/landing-nav'
import { LandingNav } from './_components/landing-nav'
import { getCurrentUser } from '@/lib/session'
import HomePageWrapper from '@/components/shared/home-page-wrapper'
import Link from 'next/link'
import url from '@/constants/url'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '../config'
import { ChevronRight } from 'lucide-react'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: MarketingLayoutProps) {
  // CHECK IF USER EXIST.. THEN REDIRECT TO DASHBOARD
  // if (userId) {
  //   const organization = await db.organization.findFirst({
  //     where: {
  //       userId
  //     }
  //   })

  //   if (organization) {
  //     redirect(`/${organization.id}`)
  //   }
  // }

  const user = await getCurrentUser()
  const showBanner = process.env.SHOW_BANNER === 'true'

  return (
    <div className='flex min-h-screen flex-col'>
      {/* <HomePageWrapper> */}
      {showBanner && (
        <Link
          className='group fixed top-0 z-50 block w-full  bg-teal-500 p-4 text-center transition-all duration-300 hover:bg-teal-400 '
          href='/national-convention'
        >
          <div className='mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8'>
            <p className='me-2 inline-block text-xs text-gray-800 dark:text-gray-200 sm:text-sm'>
              25th DSAP National Convention April 24-26, 2024
            </p>
            <span className='inline-flex items-center justify-center gap-x-2 text-xs font-semibold text-white decoration-2 group-hover:underline sm:text-sm '>
              Register Now
              <ChevronRight className='h-4 w-4' />
            </span>
          </div>
        </Link>
      )}

      <header
        className={cn(
          'supports-backdrop-blur:bg-background/60 fixed top-0 z-40 w-full border-b bg-background/95 px-3 py-2 backdrop-blur 2xl:px-20',
          showBanner && '  mt-14'
        )}
      >
        <LandingNav userId={user?.id} />
      </header>

      {/* </HomePageWrapper> */}

      <main className='relative'>{children}</main>

      <SiteFooter className='mt-16' />
    </div>
  )
}
